const LawyerAvailability = require("../../models/lawyerAvailabilityModel");
const CalendarBlock = require("../../models/calendarBlockModel");
const Appointment = require("../../models/appointmentModel");
const PaymentTransaction = require("../../models/paymentTransactionModel");
const Setting = require("../../models/settingModel");

function sendError(res, statusCode, message) {
    return res.status(statusCode >= 500 ? 500 : 200).json({ status_code: statusCode, message });
}

function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
}

function parseDateParam(value) {
    if (!value) return null;
    const date = new Date(value);
    return isValidDate(date) ? date : null;
}

function parseLocalDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
    const parts = value.split("-").map(Number);
    return { year: parts[0], month: parts[1], day: parts[2] };
}

function parseTime(value) {
    if (!/^\d{2}:\d{2}$/.test(value || "")) return null;
    const parts = value.split(":").map(Number);
    if (parts[0] > 23 || parts[1] > 59) return null;
    return { hour: parts[0], minute: parts[1] };
}

function addDays(localDate, days) {
    const date = new Date(Date.UTC(localDate.year, localDate.month - 1, localDate.day + days));
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    };
}

function localDateToString(localDate) {
    const month = String(localDate.month).padStart(2, "0");
    const day = String(localDate.day).padStart(2, "0");
    return `${localDate.year}-${month}-${day}`;
}

function compareLocalDates(left, right) {
    const leftValue = Date.UTC(left.year, left.month - 1, left.day);
    const rightValue = Date.UTC(right.year, right.month - 1, right.day);
    return leftValue - rightValue;
}

function getZonedParts(date, timezone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const values = {};
    formatter.formatToParts(date).forEach((part) => {
        if (part.type !== "literal") values[part.type] = Number(part.value);
    });
    if (values.hour === 24) values.hour = 0;
    return values;
}

function localDateTimeToUtc(localDate, time, timezone) {
    const desiredUtc = Date.UTC(localDate.year, localDate.month - 1, localDate.day, time.hour, time.minute);
    let guess = new Date(desiredUtc);

    for (let i = 0; i < 3; i += 1) {
        const zoned = getZonedParts(guess, timezone);
        const actualUtc = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute);
        const diff = desiredUtc - actualUtc;
        if (diff === 0) break;
        guess = new Date(guess.getTime() + diff);
    }

    return guess;
}

function localDayOfWeek(localDate) {
    return new Date(Date.UTC(localDate.year, localDate.month - 1, localDate.day)).getUTCDay();
}

function minutesFromTimeParts(parts) {
    return (parts.hour * 60) + parts.minute;
}

function overlapsRange(itemStart, itemEnd, rangeStart, rangeEnd) {
    return itemStart < rangeEnd && itemEnd > rangeStart;
}

function serializeAppointment(appointment) {
    const item = appointment.toObject ? appointment.toObject() : appointment;
    return Object.assign({}, item, {
        appointment_id: String(item._id),
    });
}

function serializeBlock(block) {
    const item = block.toObject ? block.toObject() : block;
    return Object.assign({}, item, {
        block_id: String(item._id),
    });
}

async function calendarHasOverlap(taskerId, startAt, endAt, excludeAppointmentId) {
    const blockFilter = {
        tasker_id: taskerId,
        start_at: { $lt: endAt },
        end_at: { $gt: startAt },
    };
    if (excludeAppointmentId) {
        blockFilter.appointment_id = { $ne: String(excludeAppointmentId) };
    }

    const appointmentFilter = {
        tasker_id: taskerId,
        status: { $ne: "cancelled" },
        start_at: { $lt: endAt },
        end_at: { $gt: startAt },
    };
    if (excludeAppointmentId) {
        appointmentFilter._id = { $ne: excludeAppointmentId };
    }

    const blockCount = await CalendarBlock.countDocuments(blockFilter);
    if (blockCount > 0) return true;

    const appointmentCount = await Appointment.countDocuments(appointmentFilter);
    return appointmentCount > 0;
}

function availabilityAllowsSlot(availability, startAt, endAt) {
    const now = new Date();
    const minStart = new Date(now.getTime() + (availability.min_notice_minutes * 60000));
    const maxStart = new Date(now.getTime() + (availability.booking_window_days * 86400000));
    if (startAt < minStart || startAt > maxStart) return false;

    const startParts = getZonedParts(startAt, availability.timezone);
    const endParts = getZonedParts(endAt, availability.timezone);
    if (
        startParts.year !== endParts.year ||
        startParts.month !== endParts.month ||
        startParts.day !== endParts.day
    ) {
        return false;
    }

    const localDate = { year: startParts.year, month: startParts.month, day: startParts.day };
    const slotStartMinutes = minutesFromTimeParts(startParts);
    const slotEndMinutes = minutesFromTimeParts(endParts);

    return availability.weekly_windows.some((window) => {
        if (window.enabled === false || window.day_of_week !== localDayOfWeek(localDate)) return false;
        const windowStartTime = parseTime(window.start_time);
        const windowEndTime = parseTime(window.end_time);
        if (!windowStartTime || !windowEndTime) return false;
        return slotStartMinutes >= minutesFromTimeParts(windowStartTime) &&
            slotEndMinutes <= minutesFromTimeParts(windowEndTime);
    });
}

async function createStripeIntent(appointment, transaction) {
    const appSettings = await Setting.findOne({});
    if (!appSettings || !appSettings.stripePrivateKey) {
        throw new Error("Stripe is not configured");
    }

    const stripe = require("stripe")(appSettings.stripePrivateKey);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: appointment.price_amount,
        currency: appointment.currency.toLowerCase(),
        metadata: {
            appointment_id: String(appointment._id),
            transaction_id: String(transaction._id),
            tasker_id: appointment.tasker_id,
        },
    });

    transaction.provider_payment_id = paymentIntent.id;
    await transaction.save();

    return paymentIntent.client_secret;
}

exports.getAvailability = async function (req, res) {
    try {
        let availability = await LawyerAvailability.findOne({ tasker_id: req.params.tasker_id });
        if (!availability) {
            availability = {
                tasker_id: req.params.tasker_id,
                timezone: "America/New_York",
                slot_duration_minutes: 60,
                buffer_minutes: 0,
                min_notice_minutes: 120,
                booking_window_days: 60,
                weekly_windows: [],
            };
        }
        return res.status(200).json({ status_code: 200, availability });
    } catch (error) {
        return sendError(res, 500, "Unable to load availability");
    }
};

exports.updateAvailability = async function (req, res) {
    try {
        const weeklyWindows = Array.isArray(req.body.weekly_windows) ? req.body.weekly_windows : [];
        for (const window of weeklyWindows) {
            if (parseTime(window.start_time) === null || parseTime(window.end_time) === null) {
                return sendError(res, 400, "Invalid availability time format");
            }
        }

        const availability = await LawyerAvailability.findOneAndUpdate(
            { tasker_id: req.params.tasker_id },
            {
                $set: {
                    tasker_id: req.params.tasker_id,
                    timezone: req.body.timezone || "America/New_York",
                    slot_duration_minutes: req.body.slot_duration_minutes || 60,
                    buffer_minutes: req.body.buffer_minutes || 0,
                    min_notice_minutes: req.body.min_notice_minutes || 120,
                    booking_window_days: req.body.booking_window_days || 60,
                    weekly_windows: weeklyWindows,
                    updated_at: new Date(),
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({ status_code: 200, availability });
    } catch (error) {
        return sendError(res, 500, "Unable to save availability");
    }
};

exports.listCalendarBlocks = async function (req, res) {
    try {
        const from = parseDateParam(req.query.from);
        const to = parseDateParam(req.query.to);
        const filter = { tasker_id: req.params.tasker_id };

        if (from || to) {
            if (!from || !to) return sendError(res, 400, "Both from and to are required");
            filter.start_at = { $lt: to };
            filter.end_at = { $gt: from };
        }

        const blocks = await CalendarBlock.find(filter).sort({ start_at: 1 });
        return res.status(200).json({ status_code: 200, blocks: blocks.map(serializeBlock) });
    } catch (error) {
        return sendError(res, 500, "Unable to load calendar blocks");
    }
};

exports.createCalendarBlock = async function (req, res) {
    try {
        const startAt = parseDateParam(req.body.start_at);
        const endAt = parseDateParam(req.body.end_at);

        if (!startAt || !endAt || startAt >= endAt) {
            return sendError(res, 400, "Invalid block time range");
        }

        const block = await CalendarBlock.create({
            tasker_id: req.params.tasker_id,
            start_at: startAt,
            end_at: endAt,
            reason: req.body.reason || "",
            source: "manual",
            created_by: req.body.created_by || req.body.user_id || null,
        });

        return res.status(200).json({ status_code: 200, block: serializeBlock(block) });
    } catch (error) {
        return sendError(res, 500, "Unable to create calendar block");
    }
};

exports.deleteCalendarBlock = async function (req, res) {
    try {
        const result = await CalendarBlock.deleteOne({
            _id: req.params.block_id,
            tasker_id: req.params.tasker_id,
            source: "manual",
        });

        if (result.deletedCount === 0) {
            return sendError(res, 404, "Calendar block not found");
        }

        return res.status(200).json({ status_code: 200 });
    } catch (error) {
        return sendError(res, 500, "Unable to delete calendar block");
    }
};

exports.availableSlots = async function (req, res) {
    try {
        const fromLocal = parseLocalDate(req.query.from);
        const toLocal = parseLocalDate(req.query.to);
        if (!fromLocal || !toLocal || compareLocalDates(fromLocal, toLocal) > 0) {
            return sendError(res, 400, "Invalid from/to date range");
        }

        const availability = await LawyerAvailability.findOne({ tasker_id: req.params.tasker_id });
        if (!availability || !Array.isArray(availability.weekly_windows) || availability.weekly_windows.length === 0) {
            return res.status(200).json({
                status_code: 200,
                timezone: availability ? availability.timezone : "America/New_York",
                slot_duration_minutes: availability ? availability.slot_duration_minutes : 60,
                slots: [],
            });
        }

        const now = new Date();
        const minStart = new Date(now.getTime() + (availability.min_notice_minutes * 60000));
        const maxStart = new Date(now.getTime() + (availability.booking_window_days * 86400000));
        const rangeStart = localDateTimeToUtc(fromLocal, { hour: 0, minute: 0 }, availability.timezone);
        const afterTo = addDays(toLocal, 1);
        const rangeEnd = localDateTimeToUtc(afterTo, { hour: 0, minute: 0 }, availability.timezone);

        const blocks = await CalendarBlock.find({
            tasker_id: req.params.tasker_id,
            start_at: { $lt: rangeEnd },
            end_at: { $gt: rangeStart },
        }).select("start_at end_at");

        const appointments = await Appointment.find({
            tasker_id: req.params.tasker_id,
            status: { $ne: "cancelled" },
            start_at: { $lt: rangeEnd },
            end_at: { $gt: rangeStart },
        }).select("start_at end_at");

        const slots = [];
        let day = fromLocal;
        while (compareLocalDates(day, toLocal) <= 0) {
            const dayWindows = availability.weekly_windows.filter((window) => {
                return window.enabled !== false && window.day_of_week === localDayOfWeek(day);
            });

            for (const window of dayWindows) {
                const windowStartTime = parseTime(window.start_time);
                const windowEndTime = parseTime(window.end_time);
                if (!windowStartTime || !windowEndTime) continue;

                let slotStart = localDateTimeToUtc(day, windowStartTime, availability.timezone);
                const windowEnd = localDateTimeToUtc(day, windowEndTime, availability.timezone);
                const step = (availability.slot_duration_minutes + availability.buffer_minutes) * 60000;
                const duration = availability.slot_duration_minutes * 60000;

                while (slotStart.getTime() + duration <= windowEnd.getTime()) {
                    const slotEnd = new Date(slotStart.getTime() + duration);
                    const outsideBookingRules = slotStart < minStart || slotStart > maxStart;
                    const blocked = blocks.some((block) => overlapsRange(slotStart, slotEnd, block.start_at, block.end_at));
                    const booked = appointments.some((appointment) => overlapsRange(slotStart, slotEnd, appointment.start_at, appointment.end_at));

                    if (!outsideBookingRules && !blocked && !booked) {
                        const startParts = getZonedParts(slotStart, availability.timezone);
                        const endParts = getZonedParts(slotEnd, availability.timezone);
                        slots.push({
                            start_at: slotStart.toISOString(),
                            end_at: slotEnd.toISOString(),
                            local_date: localDateToString({ year: startParts.year, month: startParts.month, day: startParts.day }),
                            local_start_time: `${String(startParts.hour).padStart(2, "0")}:${String(startParts.minute).padStart(2, "0")}`,
                            local_end_time: `${String(endParts.hour).padStart(2, "0")}:${String(endParts.minute).padStart(2, "0")}`,
                        });
                    }

                    slotStart = new Date(slotStart.getTime() + step);
                }
            }

            day = addDays(day, 1);
        }

        return res.status(200).json({
            status_code: 200,
            timezone: availability.timezone,
            slot_duration_minutes: availability.slot_duration_minutes,
            slots,
        });
    } catch (error) {
        return sendError(res, 500, "Unable to load available slots");
    }
};

exports.listAppointments = async function (req, res) {
    try {
        const filter = { tasker_id: req.params.tasker_id };
        const from = parseDateParam(req.query.from);
        const to = parseDateParam(req.query.to);

        if (from || to) {
            filter.start_at = {};
            if (from) filter.start_at.$gte = from;
            if (to) filter.start_at.$lte = to;
        }
        if (req.query.status) filter.status = req.query.status;
        if (req.query.payment_status) filter.payment_status = req.query.payment_status;

        const appointments = await Appointment.find(filter).sort({ start_at: 1 });
        return res.status(200).json({ status_code: 200, appointments: appointments.map(serializeAppointment) });
    } catch (error) {
        return sendError(res, 500, "Unable to load appointments");
    }
};

exports.createAppointment = async function (req, res) {
    try {
        const startAt = parseDateParam(req.body.start_at);
        const endAt = parseDateParam(req.body.end_at);
        const paymentMethod = req.body.payment_method;

        if (!startAt || !endAt || startAt >= endAt) return sendError(res, 400, "Invalid appointment time range");
        if (!["online", "cash"].includes(paymentMethod)) return sendError(res, 400, "Invalid payment method");
        if (!["online", "in-person"].includes(req.body.type)) return sendError(res, 400, "Invalid appointment type");
        if (typeof req.body.price_amount !== "number" || req.body.price_amount < 0) return sendError(res, 400, "Invalid appointment price");

        const availability = await LawyerAvailability.findOne({ tasker_id: req.params.tasker_id });
        if (!availability) return sendError(res, 400, "Lawyer availability is not configured");

        if (!availabilityAllowsSlot(availability, startAt, endAt)) {
            return sendError(res, 409, "Requested time is outside lawyer availability");
        }

        const overlaps = await calendarHasOverlap(req.params.tasker_id, startAt, endAt);
        if (overlaps) return sendError(res, 409, "Slot is no longer available");

        if (paymentMethod === "online") {
            const appSettings = await Setting.findOne({});
            if (!appSettings || !appSettings.stripePrivateKey) {
                return sendError(res, 500, "Stripe is not configured");
            }
        }

        const appointment = await Appointment.create({
            tasker_id: req.params.tasker_id,
            client_id: req.body.client_id || null,
            client_name: req.body.client_name || "",
            client_email: req.body.client_email || "",
            client_phone: req.body.client_phone || "",
            case_id: req.body.case_id || null,
            reference_id: req.body.reference_id || null,
            title: req.body.title || "Consultation",
            start_at: startAt,
            end_at: endAt,
            timezone: availability.timezone,
            type: req.body.type,
            link: req.body.link || null,
            location: req.body.location || null,
            notes: req.body.notes || "",
            payment_method: paymentMethod,
            payment_status: paymentMethod === "online" ? "pending" : "unpaid",
            price_amount: req.body.price_amount,
            currency: req.body.currency || "USD",
        });

        await CalendarBlock.create({
            tasker_id: req.params.tasker_id,
            start_at: startAt,
            end_at: endAt,
            source: "appointment",
            appointment_id: String(appointment._id),
            reason: "Appointment",
        });

        const transaction = await PaymentTransaction.create({
            appointment_id: String(appointment._id),
            tasker_id: req.params.tasker_id,
            client_id: appointment.client_id,
            method: paymentMethod,
            status: "pending",
            amount: appointment.price_amount,
            currency: appointment.currency,
            provider: paymentMethod === "online" ? "stripe" : "manual",
        });

        const payment = {
            transaction_id: String(transaction._id),
            provider: transaction.provider,
            status: transaction.status,
        };

        if (paymentMethod === "online") {
            payment.client_secret = await createStripeIntent(appointment, transaction);
        }

        return res.status(200).json({
            status_code: 200,
            appointment: serializeAppointment(appointment),
            payment,
        });
    } catch (error) {
        return sendError(res, 500, error.message || "Unable to create appointment");
    }
};

exports.updateAppointment = async function (req, res) {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.appointment_id,
            tasker_id: req.body.tasker_id,
        });
        if (!appointment) return sendError(res, 404, "Appointment not found");

        const update = {};
        [
            "client_id", "client_name", "client_email", "client_phone", "case_id", "reference_id",
            "title", "type", "link", "location", "notes", "status",
        ].forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) update[field] = req.body[field];
        });

        const startAt = req.body.start_at ? parseDateParam(req.body.start_at) : appointment.start_at;
        const endAt = req.body.end_at ? parseDateParam(req.body.end_at) : appointment.end_at;
        if (!startAt || !endAt || startAt >= endAt) return sendError(res, 400, "Invalid appointment time range");

        if (req.body.start_at || req.body.end_at) {
            const overlaps = await calendarHasOverlap(appointment.tasker_id, startAt, endAt, appointment._id);
            if (overlaps) return sendError(res, 409, "Slot is no longer available");
            update.start_at = startAt;
            update.end_at = endAt;
        }

        const updated = await Appointment.findOneAndUpdate(
            { _id: appointment._id },
            { $set: update },
            { new: true }
        );

        if (req.body.start_at || req.body.end_at) {
            await CalendarBlock.updateOne(
                { appointment_id: String(appointment._id), source: "appointment" },
                { $set: { start_at: startAt, end_at: endAt } }
            );
        }

        return res.status(200).json({ status_code: 200, appointment: serializeAppointment(updated) });
    } catch (error) {
        return sendError(res, 500, "Unable to update appointment");
    }
};

exports.cancelAppointment = async function (req, res) {
    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.appointment_id, tasker_id: req.body.tasker_id },
            { $set: { status: "cancelled" } },
            { new: true }
        );
        if (!appointment) return sendError(res, 404, "Appointment not found");

        await CalendarBlock.deleteMany({
            appointment_id: String(appointment._id),
            source: "appointment",
        });

        return res.status(200).json({ status_code: 200, appointment: serializeAppointment(appointment) });
    } catch (error) {
        return sendError(res, 500, "Unable to cancel appointment");
    }
};

exports.markAppointmentPaid = async function (req, res) {
    try {
        const paidAt = new Date();
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: req.params.appointment_id,
                tasker_id: req.body.tasker_id,
                payment_method: "cash",
            },
            { $set: { payment_status: "paid", paid_at: paidAt } },
            { new: true }
        );
        if (!appointment) return sendError(res, 404, "Cash appointment not found");

        await PaymentTransaction.findOneAndUpdate(
            {
                appointment_id: String(appointment._id),
                tasker_id: req.body.tasker_id,
                method: "cash",
            },
            {
                $set: {
                    status: "paid",
                    paid_at: paidAt,
                    marked_paid_by: req.body.marked_paid_by || req.body.user_id || null,
                },
            },
            { new: true }
        );

        return res.status(200).json({ status_code: 200, appointment: serializeAppointment(appointment) });
    } catch (error) {
        return sendError(res, 500, "Unable to mark appointment paid");
    }
};

exports.paymentWebhook = async function (req, res) {
    try {
        const event = req.body || {};
        const eventType = event.type;
        const paymentIntent = event.data && event.data.object ? event.data.object : event;
        const providerPaymentId = paymentIntent.id || req.body.provider_payment_id;

        if (!providerPaymentId) return sendError(res, 400, "Invalid webhook payload");

        if (eventType && eventType !== "payment_intent.succeeded") {
            return res.status(200).json({ status_code: 200, received: true });
        }

        const paidAt = new Date();
        const transaction = await PaymentTransaction.findOneAndUpdate(
            { provider_payment_id: providerPaymentId },
            { $set: { status: "paid", paid_at: paidAt } },
            { new: true }
        );
        if (!transaction) return sendError(res, 404, "Payment transaction not found");

        await Appointment.updateOne(
            { _id: transaction.appointment_id },
            { $set: { payment_status: "paid", paid_at: paidAt } }
        );

        return res.status(200).json({ status_code: 200, received: true });
    } catch (error) {
        return sendError(res, 500, "Unable to process payment webhook");
    }
};

exports.revenue = async function (req, res) {
    try {
        const from = parseDateParam(req.query.from);
        const to = parseDateParam(req.query.to);
        if (!from || !to) return sendError(res, 400, "Both from and to are required");

        const groupBy = req.query.group_by || "day";
        let format = "%Y-%m-%d";
        if (groupBy === "month") format = "%Y-%m";
        if (groupBy === "week") format = "%G-W%V";

        const revenue = await PaymentTransaction.aggregate([
            {
                $match: {
                    tasker_id: req.params.tasker_id,
                    status: "paid",
                    paid_at: { $gte: from, $lte: to },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format, date: "$paid_at" } },
                    total_amount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return res.status(200).json({
            status_code: 200,
            revenue: revenue.map((item) => ({
                period: item._id,
                total_amount: item.total_amount,
                count: item.count,
            })),
        });
    } catch (error) {
        return sendError(res, 500, "Unable to load revenue");
    }
};

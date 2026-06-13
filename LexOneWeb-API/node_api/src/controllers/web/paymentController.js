const Setting = require('../../models/settingModel');
const Booking = require('../../models/bookingModel');
const BookingDetail = require('../../models/bookingdetailModel');
const User = require('../../models/userModel');
const Payment = require('../../models/paymentModel');
const path = require("path");
const { I18n } = require('i18n');

/**
 * create a new instance
 */
const i18n = new I18n()

/**
 * later in code configure
 */
i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
})

// email service
const mailerController = require('./mailController');

// fcm service
const fcmService = require('./fcmController');

// notification history
const logController = require("./logController");



exports.payBooking = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.payment_token) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let appSettings = await Setting.findOne({});

            let bookingDetails = await Booking.findById(req.body.booking_id);
            let tasker = await User.findById(bookingDetails.taskerId);
            let languageType = tasker.languageType;

            if (bookingDetails.userId.toString() !== userDetails._id.toString())
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            let stripe = require('stripe')(appSettings.stripePrivateKey);


            if (!userDetails.stripeCustomerId) {
                let customerDetails = await stripe.customers.create({
                    email: userDetails.email,
                    description: userDetails.email,
                    name: userDetails.email,
                    source: req.body.payment_token,
                });
                userDetails.stripeCustomerId = customerDetails.id;
                userDetails.save();
            }

            customerId = userDetails.stripeCustomerId;

            if (customerId) {
                await stripe.charges.create({
                    amount: Math.round(bookingDetails.total * 100),
                    currency: appSettings.currencyCode,
                    description: userDetails.email,
                    customer: customerId,
                }, (err, charge) => {
                    if (err) {
                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                    } else {
                        if (charge.status === "succeeded") {
                            Booking.findByIdAndUpdate(req.body.booking_id, { status: "paid" },  function (error, result) {
                                if (!error) {
                                    let paymentDetails = new Payment({ bookingId: bookingDetails._id, transactionId: charge.id, description: "booking", amount: charge.amount / 100 });
                                    paymentDetails.save(async function (error, result) {
                                        if (!error) {
                                            let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id}).populate("serviceId").populate("bookingId");
                                            let services = [];
                                            servicelist.filter(function (eachService) {
                                                let ser = {};
                                                ser.services = eachService.serviceId.name;
                                                ser.servicePrice = eachService.price;
                                                ser.serviceCount = eachService.quantity;
                                                ser.serviceTotal = eachService.total;
                                                services.push(ser);
                                            });
                                            if (userDetails.paymentEmail === "true") {
                                                let mailData = {};
                                                mailData.to = userDetails.email;
                                                mailData.subject = res.__("Payment Mail");
                                                mailData.title = res.__("Hello") + " " + userDetails.name;
                                                mailData.service = services;
                                                mailData.tax = bookingDetails.tax;
                                                mailData.commission = bookingDetails.commission;
                                                mailData.totalAmount = bookingDetails.total;
                                                mailData.message = res.__("Payment has been done successfully for booking no") + " " + bookingDetails.bookingId;
                                                mailerController.sendMail(mailData);
                                            }
                                            let txtMsg = "Payment has been completed successfully";
                                            let logMessage = res.__({ phrase: txtMsg, locale: languageType });
                                            logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", logMessage);

                                            paymentNotification(req.body.user_id, { "name": appSettings.siteName, "message": { "booking_id": bookingDetails._id, "message": logMessage } });

                                            if (bookingDetails.taskerId) {
                                                let currency = "null";
                                                logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", logMessage);
                                                paymentNotification(bookingDetails.taskerId, { "name": appSettings.siteName, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                            }

                                            return res.status(200).json({ status_code: 200, message: res.__("Payment done successfully") });
                                        }
                                        else {
                                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                                        }
                                    });
                                }
                                else {
                                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                                }
                            });
                        }
                        else {
                            return res.status(200).json({ status_code: 500, message: res.__("Payment Failed") });
                        }
                    }
                });
            }
            else {
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
            }
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.createPaylink = async function(req, res){
    if(!req.body.user_id || !req.body.booking_id ){
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }else{
        const stripe = require('stripe')('sk_test_CDDjV7z3BbUNYHhb4H37sIui');
        const session = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:3000/idemand_server/?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/idemand_server/',
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    unit_amount: 2000,
                    product_data: {
                      name: 'Order payment'
                    },
                  },
                  quantity: 1,
                }],
                mode: 'payment',
            });
        if(session.url){
            return res.status(200).json({ status_code: 500, redirect_url: session.url });
        }else{
            return res.status(200).json({ status_code: 400, message: res.__("Something went wrong") });
        }
    }
};

exports.payReward = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.payment_token || !req.body.amount) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let appSettings = await Setting.findOne({});

            let bookingDetails = await Booking.findById(req.body.booking_id);
            let tasker = await User.findById(bookingDetails.taskerId);
            let languageType = tasker.languageType;

            if (bookingDetails.userId.toString() !== userDetails._id.toString() || bookingDetails.status != "completed")
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            let stripe = require('stripe')(appSettings.stripePrivateKey);

            await stripe.charges.create({
                amount: Math.round(req.body.amount * 100),
                currency: appSettings.currencyCode,
                source: req.body.payment_token,
                description: userDetails.email,
            }, (err, charge) => {
                if (err) {
                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                } else {
                    if (charge.status === "succeeded") {
                        Booking.findByIdAndUpdate(req.body.booking_id, { reward: req.body.amount }, function (error, result) {
                            if (!error) {
                                let paymentDetails = new Payment({ bookingId: bookingDetails._id, transactionId: charge.id, description: "reward", amount: charge.amount / 100 });
                                paymentDetails.save(function (error, result) {
                                    if (!error) {
                                        let logMessage = res.__({ phrase: "Tips amount", locale: languageType }) + " " + appSettings.currencySymbol + req.body.amount + " " +res.__({ phrase: "has been received", locale: languageType });
                                        let txtMsg = "Tips amount"+ " " +"has been received";
                                        let currency = appSettings.currencySymbol + req.body.amount;
                                        logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", logMessage, currency);
                                        paymentNotification(bookingDetails.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                        return res.status(200).json({ status_code: 200, message: res.__("Payment done successfully") });
                                    }
                                    else {
                                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                                    }
                                });
                            }
                            else {
                                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                            }
                        });
                    } else {
                        return res.status(200).json({ status_code: 500, message: res.__("Payment Failed") });
                    }
                }
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.refundBooking = async function (bookingId, req, res) {
    let appSettings = await Setting.findOne({});
    let stripe = require('stripe')(appSettings.stripePrivateKey);
    let paymentDetails = await Payment.findOne({ bookingId: bookingId, description: "booking" });
    console.log("paymentDetails",paymentDetails);
    if (paymentDetails) {
        await stripe.refunds.create({payment_intent : paymentDetails.transactionId}, (err, charge) => {
            if (!err) {
                if (charge.status === "succeeded") {
                    paymentDetails.description = "refunded";
                    paymentDetails.save();
                    Booking.findByIdAndUpdate(paymentDetails.bookingId, { status: "refunded" }, function (error, result) { });
                }
            }
        });
        let bookingDetails = await Booking.findById(bookingId);
        let appSettings = await Setting.findOne({});
        let userDetails = await User.findOne({ _id: bookingDetails.userId, role: "user" });
        let languageType = userDetails.languageType;
        let messageText = 'Your payment has been refunded';
        let logMessage = i18n.__({ phrase: messageText, locale: languageType });
        bookingNotification(userDetails._id, { "name": appSettings.siteName, "message": { "user_id": userDetails._id, "message": logMessage } });
        logController.createLog(bookingDetails.userId,userDetails._id,bookingDetails._id, "booking", logMessage);

        let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id}).populate("serviceId").populate("bookingId");
        let services = [];
        servicelist.filter(function (eachService) {
            let ser = {};
            ser.services = eachService.serviceId.name;
            ser.servicePrice = eachService.price;
            ser.serviceCount = eachService.quantity;
            ser.serviceTotal = eachService.total;
            services.push(ser);
        });
        if (userDetails.bookingEmail === "true") {
            let mailData = {};
            mailData.to = userDetails.email;
            mailData.subject = i18n.__("Payment Refunded");
            mailData.title = i18n.__("Hello") + " " + userDetails.name;
            mailData.message = i18n.__("Your booking payment") + " " + bookingDetails.bookingId + " " + i18n.__("has been refunded");
            mailData.service = services;
            mailData.tax = bookingDetails.tax;
            mailData.commission = bookingDetails.commission;
            mailData.totalAmount = bookingDetails.total;
            mailerController.sendMail(mailData);
        }
    }
};
let paymentNotification = function (userId, MsgData) {
    User.findById(userId, function (error, userDetails) {
        if (!error && userDetails) {
            if (userDetails.bookingNotification === "true" && userDetails.deviceActive === 1) {
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.name, "scope": "booking", "message": JSON.stringify(MsgData) },userDetails.languageType);
            }
        }
    });
};

let bookingNotification = function (userId, MsgData) {
    User.findById(userId, function (error, userDetails) {
        if (!error && userDetails) {
            if (userDetails.bookingNotification === "true" && userDetails.deviceActive === 1) {
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.name, "scope": "booking", "message": JSON.stringify(MsgData) },userDetails.languageType);
            }
        }
    });
};
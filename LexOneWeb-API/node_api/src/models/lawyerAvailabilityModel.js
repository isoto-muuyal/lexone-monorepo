const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const availabilityWindowSchema = new Schema({
    day_of_week: { type: Number, required: true, min: 0, max: 6 },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    enabled: { type: Boolean, default: true },
}, { _id: false });

const lawyerAvailabilitySchema = new Schema({
    tasker_id: { type: String, required: true, unique: true, index: true },
    timezone: { type: String, required: true, default: "America/New_York" },
    slot_duration_minutes: { type: Number, default: 60, min: 15 },
    buffer_minutes: { type: Number, default: 0, min: 0 },
    min_notice_minutes: { type: Number, default: 120, min: 0 },
    booking_window_days: { type: Number, default: 60, min: 1 },
    weekly_windows: [availabilityWindowSchema],
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("LawyerAvailability", lawyerAvailabilitySchema);

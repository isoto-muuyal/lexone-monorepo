const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendarBlockSchema = new Schema({
    tasker_id: { type: String, required: true, index: true },
    start_at: { type: Date, required: true, index: true },
    end_at: { type: Date, required: true, index: true },
    reason: { type: String, default: "" },
    source: { type: String, enum: ["manual", "appointment", "system"], default: "manual" },
    appointment_id: { type: String, default: null, index: true },
    created_by: { type: String, default: null },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

calendarBlockSchema.index({ tasker_id: 1, start_at: 1, end_at: 1 });

module.exports = mongoose.model("CalendarBlock", calendarBlockSchema);

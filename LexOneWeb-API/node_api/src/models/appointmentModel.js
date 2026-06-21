const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    tasker_id: { type: String, required: true, index: true },
    client_id: { type: String, default: null, index: true },
    client_name: { type: String, default: "" },
    client_email: { type: String, default: "" },
    client_phone: { type: String, default: "" },
    case_id: { type: String, default: null },
    reference_id: { type: String, default: null },
    title: { type: String, default: "Consultation" },
    start_at: { type: Date, required: true, index: true },
    end_at: { type: Date, required: true, index: true },
    timezone: { type: String, required: true },
    type: { type: String, enum: ["online", "in-person"], required: true },
    link: { type: String, default: null },
    location: { type: String, default: null },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["scheduled", "completed", "cancelled", "no_show"], default: "scheduled", index: true },
    payment_method: { type: String, enum: ["online", "cash"], required: true },
    payment_status: { type: String, enum: ["unpaid", "pending", "paid", "failed", "refunded"], default: "unpaid", index: true },
    price_amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    paid_at: { type: Date, default: null },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

appointmentSchema.index({ tasker_id: 1, start_at: 1, end_at: 1 });

module.exports = mongoose.model("Appointments", appointmentSchema);

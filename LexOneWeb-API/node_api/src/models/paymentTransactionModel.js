const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentTransactionSchema = new Schema({
    appointment_id: { type: String, required: true, index: true },
    tasker_id: { type: String, required: true, index: true },
    client_id: { type: String, default: null, index: true },
    method: { type: String, enum: ["online", "cash"], required: true },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    provider: { type: String, enum: ["stripe", "manual"], required: true },
    provider_payment_id: { type: String, default: null, index: true },
    marked_paid_by: { type: String, default: null },
    paid_at: { type: Date, default: null, index: true },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("PaymentTransactions", paymentTransactionSchema);

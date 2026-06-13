const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let paymentSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: 'Bookings', required: true },
    transactionId: { type: String, required: true },
    description: { type: String, required: true, enum: ['booking', 'reward', 'refunded'] },
    amount: { type: String, required: true },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Payments", paymentSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let bookingSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: 'Bookings', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Services', required: true },
    pricing: { type: String, required: true, enum: ['unit', 'hour'], default: 'unit' },
    price: { type: String, minlength: 1, required: true },
    quantity: { type: String, minlength: 1, required: true, default: "1" },
    total: { type: String, minlength: 1, required: true },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Bookingdetails", bookingSchema);
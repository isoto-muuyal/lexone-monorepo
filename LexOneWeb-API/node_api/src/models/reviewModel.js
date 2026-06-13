const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    taskerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    mainCategory: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Bookings', required: true, unique: true },
    rating: { type: String, required: true },
    description: { type: String, required: false, default: "" },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Reviews", reviewSchema);
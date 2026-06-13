const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let bookingSchema = new Schema({
    bookingId: { type: String, minlength: 1, maxlength: 60, required: true },
    bookedName: { type: String, minlength: 1, maxlength: 60, required: false },
    bookedWhen: { type: Date, required: true },
    bookedFor: { type: String, required: false },
    bookedType: { type: String, required: true, enum: ['professional', 'marketplace', 'userneeds'] },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    userName: { type: String, required: false },
    mainCategoryName: { type: String, required: false },
    subCategoryName: { type: String, required: false },
    serviceName: { type: String, required: false },
    taskerId: { type: Schema.Types.ObjectId, ref: 'Users', required: false },
    mainCategory: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'Subcategories', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Services', required: false },
    otp: { type: String, minlength: 4, required: true },
    commission: { type: String, minlength: 1, required: true },
    tax: { type: String, minlength: 1, required: true },
    price: { type: String, minlength: 1, required: true },
    total: { type: String, minlength: 1, required: true },
    reward: { type: String, minlength: 1, required: false, default: "0" },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payments', required: false },
    status: { type: String, required: true, enum: ['requested', 'accepted', 'paid', 'started', 'cancelled', 'completed', "refunded"] },
    needStatus: { type: Number, required: false, default: 1 },
    settlement: { type: Number, required: false, default: 0 },
    sourcelocation: { type: String, trim: true, required: false },
    destLocation: { type: String, trim: true, required: false },
    location: { type: String, trim: true, required: false },
    sourceLat:{ type: String, required: false },
    destLat:{ type: String, required: false },
    lat:{ type: String, required: false },
    sourceLon: { type: String, required: false },
    destLon: { type: String, required: false },
    lon: { type: String, required: false },
    locationType: { type: String, required: false },
    loc: { type: Array, default: [] },
    serviceIds: { type: Array, default: [] },
    payoutDate: { type: Date, required: false },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Bookings", bookingSchema);



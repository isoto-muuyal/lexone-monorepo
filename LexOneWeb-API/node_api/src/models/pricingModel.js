const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let pricingSchema = new Schema({
    taskerId: { type: Schema.Types.ObjectId, ref: 'Users', required: false },
    mainCategory: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'Subcategories', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Services', required: true },
    price: { type: Number, max: 100000, required: false, default: 0 },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Pricings", pricingSchema);
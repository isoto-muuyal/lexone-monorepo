const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let citySchema = new Schema({
    country: { type: String, required: true },
    alphaCode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Cities", citySchema);
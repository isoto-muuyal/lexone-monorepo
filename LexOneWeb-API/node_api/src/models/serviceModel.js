const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let serviceSchema = new Schema({
	name: { type: String, minLength: 3, maxlength: 40, required: true, unique: true },
	frenchName: { type: String, minLength: 3, maxlength: 30, required: false, unique: true },
    arabicName: { type: String, minLength: 3, maxlength: 30, required: false, unique: true },
	mainCategory: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
	subCategory: { type: Schema.Types.ObjectId, ref: 'Subcategories', required: true },
	image: { type: String, maxlength: 30, required: false, default: "service.png" },
	serviceCost: { type: Number, min: 1, max: 12, required: true },
	costType: { type: String, required: true, enum: ['unit', 'hour'], default: 'unit' },
	duration: { type: Number, min: 1, max: 4, required: false },
	status: { type: Number, required: false, default: 1 },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Services", serviceSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let subcategorySchema = new Schema({
    name: { type: String, minLength: 3, maxlength: 30, required: true, unique: true },
    frenchName: { type: String, minLength: 3, maxlength: 30, required: false, unique: true },
    arabicName: { type: String, minLength: 3, maxlength: 30, required: false, unique: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
    image: { type: String, maxlength: 30, required: false, default: "category.png" },
    status: { type: Number, required: false, default: 1 },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Subcategories", subcategorySchema);
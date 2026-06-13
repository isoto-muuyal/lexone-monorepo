const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: { type: String, minlength: 3, maxlength: 30, required: true, unique: true },
    frenchName: { type: String, minlength: 3, maxlength: 30, required: false, unique: true },
    arabicName: { type: String, minlength: 3, maxlength: 30, required: false, unique: true },
    type: { type: String, required: true, enum: ['professional', 'marketplace'] },
    image: { type: String, maxlength: 30, required: false, default: "category.png" },
    rating: { type: String, required: false, minlength: 1, maxlength: 2, default: "0" }, // category's rating
    about: { type: String, required: false },
    aboutArabic: { type: String, required: false },
    aboutFrench: { type: String, required: false },
    description: { type: String, required: false },
    descriptionArabic: { type: String, required: false },
    descriptionFrench: { type: String, required: false },
    locationType: { type: String, required: false },
    faq: { type: String, required: false },
    faqArabic: { type: String, required: false },
    faqFrench: { type: String, required: false },
    featured: { type: Number, required: false, default: 0 },
    status: { type: Number, required: false, default: 1 },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Categories", categorySchema);
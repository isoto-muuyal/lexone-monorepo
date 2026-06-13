const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mediaSchema = new Schema({
    media_name: { type: String, minLength: 3, maxlength: 120, required: true },
    name: { type: String, minLength: 3, maxlength: 120, required: false },
    type: { type: String, required: true, minLength: 3, maxlength: 6, },
    for: { type: String, required: true, enum: ['portfolio', 'document'] },
    taskerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Uploads", mediaSchema);
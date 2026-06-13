const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let helpSchema = new Schema({
    name: { type: String, minLength: 3, maxlength: 250, required: true },
    type: { type: String, required: true, enum: ['tasker', 'user'] },
    description: { type: String, required: true },
    status: { type: Number, required: false, default: 1 },
    default: { type: Number, required: false, default: 1 },
}, { timestamps: true });   

// exports model
module.exports = mongoose.model("Helps", helpSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let adminChatsSchema = new Schema({
    msg_type: { type: String, required: true },
    msg_from: { type: String, required: true },
    msg_platform: { type: String, required: true },
    msg_to: { type: String, required: true },
    msg_data: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

// exports model
module.exports = mongoose.model("adminchats", adminChatsSchema);
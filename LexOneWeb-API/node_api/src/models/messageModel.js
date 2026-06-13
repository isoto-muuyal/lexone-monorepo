const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chats', required: true },
    chatData: { type: Object, required: true },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Messages", messageSchema);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
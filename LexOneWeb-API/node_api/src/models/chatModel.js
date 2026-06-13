const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let chatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    taskerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Bookings', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Services', required: false },
    blockedBy: { type: Array, required: false, default: [] },
    userUnread: { type: Number, required: false, default: 0 },
    taskerUnread: { type: Number, required: false, default: 0 },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Messages', required: false },
    lastMessageOn: { type: Date, default: Date.now() },
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Chats", chatSchema);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
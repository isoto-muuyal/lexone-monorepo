const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let logSchema = new Schema({
    logId : {type: String, index: {unique: true, dropDups: true}},
    senderId: { type: Schema.Types.ObjectId, ref: 'Users', required: false },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    messageTxt: { type: String, required: true },
    type: { type: String, required: true },
    currency: { type: String, required: false },
    messageType: { type: String, required: true, enum: ["booking", "review"], default: "admin" },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Bookings', required: true, },
    serviceId: { type: Array, required: true },
    isAdmin: { type: Number, required: false, enum: [0, 1], default: 0 },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
});

// exports model
module.exports = mongoose.model("Logs", logSchema);
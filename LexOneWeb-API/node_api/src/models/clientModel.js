const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    tasker_id: { type: String, required: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    case_ids: [String],
    notes: { type: String, default: "" },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Clients", clientSchema);

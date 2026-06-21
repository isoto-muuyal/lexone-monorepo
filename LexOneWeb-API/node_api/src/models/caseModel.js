const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const caseDocumentSchema = new Schema({
    type: { type: String, default: "" },
    version: { type: Number, required: true },
    file_name: { type: String, required: true },
    file_url: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const caseSchema = new Schema({
    tasker_id: { type: String, required: true, index: true },
    client_id: { type: String, default: null, index: true },
    client_name: { type: String, default: "" },
    reference_id: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, enum: ["started", "accepted", "completed", "pending"], default: "started" },
    created_date: { type: Date, default: Date.now },
    documents: [caseDocumentSchema],
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Cases", caseSchema);

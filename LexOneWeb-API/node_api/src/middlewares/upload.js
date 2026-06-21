const fs = require("fs");
const path = require("path");
const multer = require("multer");

const DOCUMENTS_DIR = path.join(__dirname, "..", "public", "documents");
fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DOCUMENTS_DIR);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        cb(null, `${Date.now()}_${safeName}`);
    },
});

module.exports = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports.DOCUMENTS_DIR = DOCUMENTS_DIR;

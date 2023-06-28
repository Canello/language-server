const multer = require("multer");
const uuid = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "/uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, "audio" + uuid.v4() + ".wav");
    },
});

exports.uploadAudio = multer({
    storage: storage,
    limits: { fileSize: 10 * 1000 * 1000 }, // Limitar áudios até 10MB
}).single("file");

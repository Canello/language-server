const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "audio" + uuid.v4() + ".wav");
    },
});

exports.uploadAudio = multer({
    storage: storage,
    limits: { fileSize: 70000000 }, // Limitar áudios até 70MB
}).single("file");

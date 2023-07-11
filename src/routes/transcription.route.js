const express = require("express");
const {
    transcription,
} = require("../controllers/transcription/transcription.controller");
const { auth } = require("../middlewares/auth.middleware");
const {
    checkSubscription,
} = require("../middlewares/check-subscription.middleware");
const { uploadAudio } = require("../middlewares/upload-audio.middleware");

const router = express.Router();

router.post("/", auth, checkSubscription, uploadAudio, transcription);

module.exports = router;

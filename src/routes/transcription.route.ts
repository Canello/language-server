import express from "express";
import { transcription } from "../controllers/transcription/transcription.controller";
import { auth } from "../middlewares/auth.middleware";
import { checkSubscription } from "../middlewares/check-subscription.middleware";
import { uploadAudio } from "../middlewares/upload-audio.middleware";

const router = express.Router();

router.post("/", auth, checkSubscription, uploadAudio, transcription);

export default router;

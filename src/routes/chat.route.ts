import express from "express";
import { chat } from "../controllers/chat/chat.controller";
import { auth } from "../middlewares/auth.middleware";
import { checkSubscription } from "../middlewares/check-subscription.middleware";

const router = express.Router();

router.post("/", auth, checkSubscription, chat);

export default router;

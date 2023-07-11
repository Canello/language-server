const express = require("express");
const { chat } = require("../controllers/chat.controller");
const { auth } = require("../middlewares/auth.middleware");
const {
    checkSubscription,
} = require("../middlewares/check-subscription.middleware");

const router = express.Router();

router.post("/", auth, checkSubscription, chat);

module.exports = router;

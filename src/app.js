const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");
const { transcription } = require("./controllers/transcription.controller");
const { uploadAudio } = require("./middlewares/upload-audio.middleware");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const { chat } = require("./controllers/chat.controller");
const { auth } = require("./middlewares/auth.middleware");
const {
    checkSubscription,
} = require("./middlewares/check-subscription.middleware");

const authRouter = require("./routes/auth.route");
const mercadoPagoRouter = require("./routes/mercado-pago.route");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/transcription", auth, checkSubscription, uploadAudio, transcription);
app.post("/chat", auth, checkSubscription, chat);
app.use("/auth", authRouter);
app.use("/mercado-pago", mercadoPagoRouter);

app.use(errorHandler);

module.exports = { app };

const express = require("express");
const cors = require("cors");
require("express-async-errors");
const transcriptionRouter = require("./routes/transcription.route");
const chatRouter = require("./routes/chat.route");
const authRouter = require("./routes/auth.route");
const mercadoPagoRouter = require("./routes/mercado-pago.route");
const { errorHandler } = require("./middlewares/error-handler.middleware");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/transcription", transcriptionRouter);
app.use("/chat", chatRouter);
app.use("/auth", authRouter);
app.use("/mercado-pago", mercadoPagoRouter);

app.use(errorHandler);

module.exports = { app };

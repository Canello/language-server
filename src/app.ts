import express from "express";
import cors from "cors";
import transcriptionRouter from "./routes/transcription.route";
import chatRouter from "./routes/chat.route";
import authRouter from "./routes/auth.route";
import mercadoPagoRouter from "./routes/mercado-pago.route";
import { errorHandler } from "./middlewares/error-handler.middleware";
require("express-async-errors");

export const app = express();

app.use(express.json());
// app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");

    next();
});

app.use("/transcription", transcriptionRouter);
app.use("/chat", chatRouter);
app.use("/auth", authRouter);
app.use("/mercado-pago", mercadoPagoRouter);

app.use(errorHandler);

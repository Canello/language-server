const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
require("express-async-errors");

const { transcription } = require("./controllers/transcription.controller");
const { uploadAudio } = require("./middlewares/upload-audio.middleware");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const { chat } = require("./controllers/chat.controller");
const {
    loginWithGoogle,
    signin,
    signup,
    getUser,
    getPasswordResetLink,
    changePassword,
} = require("./controllers/auth.controller");
const { auth } = require("./middlewares/auth.middleware");
const {
    checkSubscription,
} = require("./middlewares/check-subscription.middleware");
const {
    mercadopagoWebhook,
    createPreference,
} = require("./controllers/mercado-pago.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/transcription", auth, checkSubscription, uploadAudio, transcription);
app.post("/chat", auth, checkSubscription, chat);
// app.post("/auth/google", loginWithGoogle);
app.post("/auth/signin", signin);
app.post("/auth/signup", signup);
app.get("/auth/user", auth, getUser);
app.post("/auth/reset-link", getPasswordResetLink);
app.post("/auth/change-password", changePassword);
app.post("/mercado-pago/preferences", auth, createPreference);
app.post("/mercado-pago/webhooks", mercadopagoWebhook);

app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    console.log("Listening on port", process.env.PORT);

    await mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.u6ck6wo.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log("MongoDB is", mongoose.STATES[mongoose.connection.readyState]);
});

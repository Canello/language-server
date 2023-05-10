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
} = require("./controllers/auth.controller");
const { auth } = require("./middlewares/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/transcription", uploadAudio, transcription);
app.post("/chat", chat);
app.post("/auth/google", loginWithGoogle);
app.post("/auth/signin", signin);
app.post("/auth/signup", signup);
app.get("/auth/user", auth, getUser);

app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    console.log("Listening on port", process.env.PORT);

    await mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.u6ck6wo.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log("MongoDB is", mongoose.STATES[mongoose.connection.readyState]);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { transcription } = require("./controllers/transcription.controller");
const { uploadAudio } = require("./middlewares/upload-audio.middleware");
const { chat } = require("./controllers/chat.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/transcription", uploadAudio, transcription);
app.post("/chat", chat);

app.listen(process.env.PORT, () => {
    console.log("Listening on port", process.env.PORT);
});

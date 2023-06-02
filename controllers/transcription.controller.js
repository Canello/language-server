const fs = require("fs");
const path = require("path");
const { getAudioDurationInSeconds } = require("get-audio-duration");

const OpenAI = require("../models/openai.model");
const Usage = require("../models/usage.model");

exports.transcription = async (req, res, next) => {
    const { userId } = req.headers;
    const { filename } = req.file;

    const filepath = path.join(__dirname, "..", "uploads", filename);

    // Evitar áudios com mais de 5min
    // const durationInSeconds = await getAudioDurationInSeconds(filepath);
    // if (durationInSeconds > 300)
    //     throw new Error("O áudio deve ser menor que 5 minutos.");

    // Trackear uso por duração do áudio
    // const usage = new Usage({
    //     userId,
    //     type: "transcription",
    //     model: process.env.TRANSCRIPTION_MODEL,
    //     durationInSeconds,
    // });
    // usage.save();

    // Transcription
    const file = fs.readFileSync(filepath);
    const transcription = await OpenAI.transcript(filename, file);

    // Excluir audio file temporária
    fs.unlink(filepath, (err) => {
        if (err) console.log(err);
    });

    res.json({
        data: { transcription },
    });
};

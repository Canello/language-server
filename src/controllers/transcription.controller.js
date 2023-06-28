const fs = require("fs");
const path = require("path");

const OpenAI = require("../models/openai.model");
const Usage = require("../models/usage.model");
const User = require("../models/user.model");

exports.transcription = async (req, res, next) => {
    const { userId } = req.headers;
    const { filename, size } = req.file;

    const filepath = path.join(__dirname, "..", "uploads", filename);

    // Evitar áudios com mais de 5min
    const SECONDS_PER_SIZE = 60 / 10 ** 6; // Assumindo que um minuto de áudio tem 1 MB
    const durationInSeconds = SECONDS_PER_SIZE * size;
    if (durationInSeconds > 300)
        throw new Error("O áudio deve ser menor que 5 minutos.");

    // Trackear uso por duração do áudio
    const DOLLARS_PER_SECOND = 0.006 / 60;
    const cost = durationInSeconds * DOLLARS_PER_SECOND;
    const usage = new Usage({
        userId,
        type: "transcription",
        cost,
        model: process.env.TRANSCRIPTION_MODEL,
        durationInSeconds,
    });
    usage.save();

    // Checar custo atual do usuário
    // const { subscribedAt } = await User.findById(userId);

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

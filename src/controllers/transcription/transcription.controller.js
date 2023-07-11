const fs = require("fs");
const path = require("path");
const OpenAI = require("../../models/openai.model");
const Usage = require("../../models/usage.model");
const { InvalidInputError } = require("../../errors/InvalidInputError.error");
const { UsageLimitError } = require("../../errors/UsageLimitError.errors");
const {
    hasReachedMonthlyCostLimit,
} = require("../../utils/functions/hasReachedMonthlyCostLimit");

exports.transcription = async (req, res, next) => {
    const { userId } = req.headers;
    const { filename, size } = req.file;

    const filepath = path.join(__dirname, "..", "..", "uploads", filename);

    // Checar se o usuário ultrapassou o limite mensal de uso
    const hasReachedLimit = await hasReachedMonthlyCostLimit(userId);
    if (hasReachedLimit) throw new UsageLimitError();

    // Evitar áudios com mais de 5min
    const SECONDS_PER_SIZE = 60 / 10 ** 6; // Assumindo que um minuto de áudio tem 1 MB
    const durationInSeconds = SECONDS_PER_SIZE * size;
    if (durationInSeconds > 420)
        throw new InvalidInputError("O áudio deve ser menor que 7 minutos.");

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
    await usage.save();

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

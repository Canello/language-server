const fs = require("fs");
const path = require("path");

const OpenAI = require("../models/OpenAI.model");

exports.transcription = async (req, res, next) => {
    const { filename } = req.file;

    const filePath = path.join(__dirname, "..", "uploads", filename);
    const file = fs.readFileSync(filePath);

    const transcription = await OpenAI.transcript(filename, file);

    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });

    res.json({
        data: { transcription },
    });
};

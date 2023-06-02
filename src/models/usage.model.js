const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
    {
        userId: String,
        type: String,
        model: String,
        promptTokens: { type: Number, required: false },
        completionTokens: { type: Number, required: false },
        totalTokens: { type: Number, required: false },
        durationInSeconds: { type: Number, required: false },
    },
    {
        timestamps: true,
    }
);

const Usage = mongoose.model("Usage", usageSchema);

module.exports = Usage;

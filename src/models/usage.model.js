const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        type: { type: String, required: true },
        model: { type: String, required: true },
        cost: { type: Number, required: true },
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

const { SYSTEM_PROMPT } = require("../utils/constants");
const OpenAI = require("../models/openai.model");

const Usage = require("../models/usage.model");

exports.chat = async (req, res, next) => {
    const { userId } = req.headers;
    const { messages } = req.body;

    // Chat
    messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    const { reply, promptTokens, completionTokens, totalTokens } =
        await OpenAI.chat(messages);

    // Trackear uso por tokens gastos
    const usage = new Usage({
        userId,
        type: "chat",
        model: process.env.CHAT_MODEL,
        promptTokens,
        completionTokens,
        totalTokens,
    });
    usage.save();

    res.send({
        data: { reply },
    });
};

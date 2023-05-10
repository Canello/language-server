const { SYSTEM_PROMPT } = require("../utils/constants");
const OpenAI = require("../models/openai.model");

exports.chat = async (req, res, next) => {
    const { messages } = req.body;

    messages.unshift({ role: "system", content: SYSTEM_PROMPT });

    const { reply, tokensUsed } = await OpenAI.chat(messages);

    res.send({
        data: { reply },
    });
};

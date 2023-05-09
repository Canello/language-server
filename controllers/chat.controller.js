const { SYSTEM_PROMPT } = require("../data/prompts.data");
const OpenAI = require("../models/OpenAI.model");

exports.chat = async (req, res, next) => {
    const { messages } = req.body;

    messages.unshift({ role: "system", content: SYSTEM_PROMPT });

    const { reply, tokensUsed } = await OpenAI.chat(messages);

    res.send({
        data: { reply },
    });
};

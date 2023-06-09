const { SYSTEM_PROMPT, userPrompt } = require("../../utils/constants");
const OpenAI = require("../../models/openai.model");
const Usage = require("../../models/usage.model");
const { InvalidInputError } = require("../../errors/invalid-input-error.error");
const { UsageLimitError } = require("../../errors/usage-limit-error.errors");
const {
    hasReachedMonthlyCostLimit,
} = require("../../utils/functions/hasReachedMonthlyCostLimit");

exports.chat = async (req, res, next) => {
    const { userId } = req.headers;
    const { messages } = req.body;

    // Limitar tamanho de messages
    if (messages.length > 16)
        throw new InvalidInputError(
            "Você passou do limite de mensagens para uma requisição."
        );

    // Checar se o usuário ultrapassou o limite mensal de uso
    const hasReachedLimit = await hasReachedMonthlyCostLimit(userId);
    if (hasReachedLimit) throw new UsageLimitError();

    // Chat
    messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    const lastUserMessage = messages[messages.length - 1];
    lastUserMessage.content = userPrompt(lastUserMessage.content);
    const { reply, promptTokens, completionTokens, totalTokens } =
        await OpenAI.chat(messages);

    // Trackear uso por tokens gastos
    const DOLLARS_PER_PROMPT_TOKEN = 0.0015 / 1000;
    const DOLLARS_PER_COMPLETION_TOKEN = 0.002 / 1000;
    const cost =
        promptTokens * DOLLARS_PER_PROMPT_TOKEN +
        completionTokens * DOLLARS_PER_COMPLETION_TOKEN;

    const usage = new Usage({
        userId,
        type: "chat",
        cost,
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

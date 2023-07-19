import { Request, Response, NextFunction } from "express";
import OpenAI from "../../models/openai.model";
import Usage from "../../models/usage.model";
import { InvalidInputError } from "../../errors/invalid-input-error.error";
import { UsageLimitError } from "../../errors/usage-limit-error.errors";
import { hasReachedMonthlyCostLimit } from "../../utils/functions/hasReachedMonthlyCostLimit";
import { MessagesProcessor } from "../../utils/classes/MessagesProcessor";

export const chat = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.headers as { userId: string };
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
    MessagesProcessor.process(messages);
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

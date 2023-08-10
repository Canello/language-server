import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import OpenAI from "../../models/openai.model";
import Usage from "../../models/usage.model";
import { InvalidInputError } from "../../errors/invalid-input-error.error";
import { UsageLimitError } from "../../errors/usage-limit-error.errors";
import { hasReachedMonthlyCostLimit } from "../../utils/functions/hasReachedMonthlyCostLimit";

export const transcription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.headers as { userId: string };
    const { filename, size } = req.file as { filename: string; size: number };

    const filepath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        filename
    );

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
    try {
        await fs.promises.unlink(filepath);
    } catch (err) {
        console.log("Erro ao excluir arquivo de áudio.");
        console.log(err);
    }

    res.status(200).send({
        data: { transcription },
    });
};

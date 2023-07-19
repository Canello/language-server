import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { NoCreditsError } from "../errors/no-credits-error.error";
import { AuthenticationFailedError } from "../errors/authentication-failed-error.error";

export const checkSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.headers;

    const user = await User.findById(userId);
    if (!user) throw new AuthenticationFailedError("Usuário inválido.");

    if (user.freeTrials > 0) {
        await User.updateOne({ _id: userId }, { $inc: { freeTrials: -1 } }); // Reduzir créditos gratuitos em 1
    } else if (!user.isActive) {
        throw new NoCreditsError();
    }

    next();
};

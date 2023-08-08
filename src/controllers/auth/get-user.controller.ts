import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import { NotFoundError } from "../../errors/not-found-error.error";

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.headers;

    const user = await User.findById(userId)!;
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    res.status(200).send({
        data: { user },
    });
};

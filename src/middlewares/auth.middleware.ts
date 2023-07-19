import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationFailedError } from "../errors/authentication-failed-error.error";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    let token, decodedToken;
    try {
        token = authorization!.split(" ")[1];

        decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };
    } catch (err) {
        throw new AuthenticationFailedError('"Authorization" header inválido.');
    }
    const { userId } = decodedToken;

    req.headers.userId = userId;

    next();
};

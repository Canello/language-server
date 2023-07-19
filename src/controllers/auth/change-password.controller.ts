import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.model";
import { InvalidInputError } from "../../errors/invalid-input-error.error";
import { ExpiredError } from "../../errors/expired-error.error";

export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { newPassword, token } = req.body;

    // Validar inputs
    if (newPassword.length < 8)
        throw new InvalidInputError("A senha deve ter no mínimo 8 caracteres.");
    if (newPassword.length > 50)
        throw new InvalidInputError(
            "A senha deve ter no máximo 50 caracteres."
        );

    // Validar jwt e extrair email
    let decodedToken, email;
    try {
        decodedToken = jwt.verify(
            token,
            process.env.RESET_PASSWORD_JWT_SECRET!
        ) as { email: string };
        email = decodedToken.email;
    } catch (err) {
        throw new ExpiredError(
            "Esse link para redefinir senha expirou ou é inválido. Solicite outro."
        );
    }

    // Atualizar senha do usuário com o email fornecido
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).send({
        status: "ok",
    });
};

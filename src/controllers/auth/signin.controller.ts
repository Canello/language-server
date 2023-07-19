import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.model";
import { InvalidInputError } from "../../errors/invalid-input-error.error";

export const signin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) throw new InvalidInputError("Usuário não encontrado.");

    // Validar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new InvalidInputError("Senha incorreta.");

    // Gerar JWT para autenticação de usuário
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.send({
        data: { token: userToken, user },
    });
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.model";
import { InvalidInputError } from "../../errors/invalid-input-error.error";

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { fullName, email, password } = req.body;

    // Validar inputs
    if (fullName.length < 1)
        throw new InvalidInputError("O nome deve ter no mínimo 1 caracter.");
    if (fullName.length > 100)
        throw new InvalidInputError(
            "O nome deve ter no máximo 100 caracteres."
        );
    if (email.length < 3) throw new InvalidInputError("Email inválido.");
    if (!email.includes("@")) throw new InvalidInputError("Email inválido.");
    if (password.length < 8)
        throw new InvalidInputError("A senha deve ter no mínimo 8 caracteres.");
    if (password.length > 50)
        throw new InvalidInputError(
            "A senha deve ter no máximo 50 caracteres."
        );

    // Checar se já existe um usuário cadastrado com esse email
    const existingUser = await User.findOne({ email });
    if (existingUser)
        throw new InvalidInputError("Já existe um usuário com esse email.");

    // Criar novo usuário
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ fullName, email, password: hashedPassword });
    const user = await newUser.save();

    // Gerar JWT para autenticação de usuário
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.send({
        data: { token: userToken, user },
    });
};

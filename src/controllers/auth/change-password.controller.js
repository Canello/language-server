const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const { InvalidInputError } = require("../../errors/InvalidInputError.error");
const { ExpiredError } = require("../../errors/ExpiredError.error");

exports.changePassword = async (req, res, next) => {
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
        decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_JWT_SECRET);
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

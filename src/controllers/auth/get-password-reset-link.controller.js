const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const { sendEmail } = require("../../utils/functions/sendEmail");

exports.getPasswordResetLink = async (req, res, next) => {
    const { email } = req.body;

    // Checar se existe um usuário com o email fornecido
    const user = await User.findOne({ email });
    if (!user) throw new Error("Esse email não pertence a nenhum usuário.");

    // Criar novo reset roken
    const resetToken = jwt.sign(
        { email },
        process.env.RESET_PASSWORD_JWT_SECRET,
        { expiresIn: 20 * 60 } // Expira depois de 20 minutos
    );

    // Criar link para reset
    const resetLink =
        process.env.CLIENT_ADDRESS + "/reset-password/" + resetToken;

    // Enviar email
    sendEmail({ to: email, url: resetLink });

    res.status(200).send({
        status: "ok",
        data: {
            link: resetLink,
        },
    });
};

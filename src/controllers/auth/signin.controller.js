const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const { InvalidInputError } = require("../../errors/InvalidInputError.error");

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) throw new InvalidInputError("Usuário não encontrado.");

    // Validar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new InvalidInputError("Senha incorreta.");

    // Gerar JWT para autenticação de usuário
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.send({
        data: { token: userToken, user },
    });
};

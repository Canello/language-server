const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { sendEmail } = require("../utils/functions/sendEmail");
const { InvalidInputError } = require("../errors/InvalidInputError.error");
const { ExpiredError } = require("../errors/ExpiredError.error");

exports.loginWithGoogle = async (req, res, next) => {
    const { googleToken } = req.body;

    // Decodificar e validar google token
    const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
    );
    const decodedToken = googleResponse.data;
    if (decodedToken.error) throw Error("Google token inválido.");

    // Buscar usuário ou criar novo
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
        const { email, given_name, family_name } = decodedToken;
        const newUser = new User({
            fullName: `${given_name} ${family_name}`.trim(),
            email: email,
        });
        user = await newUser.save();
    }

    // Gerar JWT para autenticação do usuário
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.send({
        data: { token: userToken, user },
    });
};

exports.signup = async (req, res, next) => {
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
    const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.send({
        data: { token: userToken, user },
    });
};

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

exports.getUser = async (req, res, next) => {
    const { userId } = req.headers;

    const user = await User.findById(userId);
    if (!user) throw new Error("Usuário não encontrado.");

    res.send({
        data: { user },
    });
};

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

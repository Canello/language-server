const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

exports.loginWithGoogle = async (req, res, next) => {
    const { googleToken } = req.body;

    // Decodificar e validar google token
    const googleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
    );
    const decodedToken = googleResponse.data;
    if (decodedToken.error) throw Error("Google token inválido.");

    // Buscar usuário ou criar novo
    let user = await User.findById(decodedToken._id);
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

    // Checar se já existe um usuário cadastrado com esse email
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Usuário já existe");

    // Criar novo usuário
    const newUser = new User({ fullName, email, password });
    const user = await newUser.save();

    // Gerar JWT para autenticação de usuário

    res.send({
        data: { user },
    });
};

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    res.send({
        data: { user },
    });
};

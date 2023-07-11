const User = require("../../models/user.model");

exports.getUser = async (req, res, next) => {
    const { userId } = req.headers;

    const user = await User.findById(userId);
    if (!user) throw new Error("Usuário não encontrado.");

    res.send({
        data: { user },
    });
};

const User = require("../../models/user.model");
const { NotFoundError } = require("../../errors/not-found-error.error");

exports.getUser = async (req, res, next) => {
    const { userId } = req.headers;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    res.send({
        data: { user },
    });
};

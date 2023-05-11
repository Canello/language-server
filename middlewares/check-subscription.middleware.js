const User = require("../models/User.model");

exports.checkSubscription = async (req, res, next) => {
    const { userId } = req.headers;

    const user = await User.findById(userId);

    if (user.freeTrials > 0) {
        await User.updateOne({ _id: userId }, { $inc: { freeTrials: -1 } }); // Reduzir créditos gratuitos em 1
    } else if (!user.isActive) {
        throw new Error("Sem créditos.");
    }

    next();
};

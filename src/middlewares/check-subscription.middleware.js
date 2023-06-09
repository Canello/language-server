const { NoCreditsError } = require("../errors/no-credits-error.error");
const User = require("../models/user.model");

exports.checkSubscription = async (req, res, next) => {
    const { userId } = req.headers;

    const user = await User.findById(userId);

    if (user.freeTrials > 0) {
        await User.updateOne({ _id: userId }, { $inc: { freeTrials: -1 } }); // Reduzir créditos gratuitos em 1
    } else if (!user.isActive) {
        throw new NoCreditsError();
    }

    next();
};

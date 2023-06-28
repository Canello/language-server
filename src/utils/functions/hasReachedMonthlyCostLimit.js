const Usage = require("../../models/usage.model");
const User = require("../../models/user.model");

exports.hasReachedMonthlyCostLimit = async (userId) => {
    const user = await User.findById(userId);

    const monthlyCostQueryResult = await Usage.aggregate([
        {
            $match: {
                userId,
                createdAt: { $lte: user.expiresAt, $gte: user.subscribedAt },
            },
        },
        {
            $group: {
                _id: null,
                sum: { $sum: "$cost" },
            },
        },
    ]);

    console.log(monthlyCostQueryResult);

    if (monthlyCostQueryResult.length > 0) {
        const monthlyCost = monthlyCostQueryResult[0].sum;

        const BRL_PER_DOLLAR = 5; // Assumindo $ 1,00 = R$ 5,00
        const MONTHLY_SUBSCRIPTION_FEE_BRL = 18;

        const hasReachedLimit =
            monthlyCost * BRL_PER_DOLLAR >= MONTHLY_SUBSCRIPTION_FEE_BRL;

        return hasReachedLimit;
    }

    return false;
};

import Usage from "../../models/usage.model";
import User from "../../models/user.model";

export const hasReachedMonthlyCostLimit = async (userId: string) => {
    const user = (await User.findById(userId))!;

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

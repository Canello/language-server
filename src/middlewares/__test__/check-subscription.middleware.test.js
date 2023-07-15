const { NoCreditsError } = require("../../errors/no-credits-error.error");
const User = require("../../models/user.model");
const { checkSubscription } = require("../check-subscription.middleware");

jest.mock("../../models/user.model");

describe("check-subscription.middleware", () => {
    const req = {
        headers: {
            userId: "09io",
        },
    };
    const res = {};
    const next = () => {};

    it("should reduce free trials by 1 if user has any free trial left", async () => {
        jest.spyOn(User, "findById").mockReturnValue({ freeTrials: 1 });
        const spyUpdateOne = jest.spyOn(User, "updateOne");

        await checkSubscription(req, res, next);

        expect(spyUpdateOne).toHaveBeenCalledTimes(1);
        expect(spyUpdateOne).toHaveBeenCalledWith(
            { _id: req.headers.userId },
            { $inc: { freeTrials: -1 } }
        );
    });

    it("should throw an error if user has no free trials and is not active", async () => {
        jest.spyOn(User, "findById").mockReturnValue({
            freeTrials: 0,
            isActive: false,
        });

        await expect(async () => {
            await checkSubscription(req, res, next);
        }).rejects.toThrow(new NoCreditsError());
    });

    it("should call next if user has no free trial but is active", async () => {
        jest.spyOn(User, "findById").mockReturnValue({
            freeTrials: 0,
            isActive: true,
        });
        const next = jest.fn(() => {});

        await checkSubscription(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});

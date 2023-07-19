import { checkSubscription } from "../check-subscription.middleware";
import { NoCreditsError } from "../../errors/no-credits-error.error";
import User from "../../models/user.model";

jest.mock("../../models/user.model");

describe("check-subscription.middleware", () => {
    const req = {
        headers: {
            userId: "09io",
        },
    } as any;
    const res = {} as any;
    const next = (() => {}) as any;

    it("should reduce free trials by 1 if user has any free trial left", async () => {
        jest.spyOn(User, "findById").mockReturnValue({ freeTrials: 1 } as any);
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
        } as any);

        await expect(async () => {
            await checkSubscription(req, res, next);
        }).rejects.toThrow(new NoCreditsError());
    });

    it("should call next if user has no free trial but is active", async () => {
        jest.spyOn(User, "findById").mockReturnValue({
            freeTrials: 0,
            isActive: true,
        } as any);
        const next = jest.fn(() => {});

        await checkSubscription(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});

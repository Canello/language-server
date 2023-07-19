import { getPasswordResetLink } from "../get-password-reset-link.controller";
import { InvalidInputError } from "../../../errors/invalid-input-error.error";
import User from "../../../models/user.model";
import { sendEmail } from "../../../utils/functions/sendEmail";

jest.mock("../../../models/user.model");
jest.mock("../../../utils/functions/sendEmail");

describe("get-password-reset-link.controller", () => {
    const req = {
        body: {
            email: "test@test.com",
        },
    } as any;
    const res = {
        status: function (statusCode: number) {
            return this;
        },
        send: (r: any) => r,
    } as any;
    const next = (() => {}) as any;

    it("throws an error if email provided does not belong to an user", async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await expect(getPasswordResetLink(req, res, next)).rejects.toThrow(
            new InvalidInputError("Esse email não pertence a nenhum usuário.")
        );
    });

    it("sends link to user via email", async () => {
        (User.findOne as jest.Mock).mockResolvedValue({});
        (sendEmail as jest.Mock).mockImplementation(() => {});
        const spyStatus = jest.spyOn(res, "status");
        const spySend = jest.spyOn(res, "send");

        await getPasswordResetLink(req, res, next);

        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(spyStatus).toHaveBeenCalledTimes(1);
        expect(spyStatus).toHaveBeenCalledWith(200);
        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            status: "ok",
        });
    });
});

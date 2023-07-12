const {
    getPasswordResetLink,
} = require("../get-password-reset-link.controller");
const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");
const User = require("../../../models/user.model");
const { sendEmail } = require("../../../utils/functions/sendEmail");

jest.mock("../../../models/user.model");
jest.mock("../../../utils/functions/sendEmail");

describe("get-password-reset-link.controller", () => {
    const req = {
        body: {
            email: "test@test.com",
        },
    };
    const res = {
        status: function (statusCode) {
            return this;
        },
        send: (r) => r,
    };

    it("throws an error if email provided does not belong to an user", async () => {
        User.findOne.mockResolvedValue(null);

        await expect(getPasswordResetLink(req, res)).rejects.toThrow(
            new InvalidInputError("Esse email não pertence a nenhum usuário.")
        );
    });

    it("sends link to user via email", async () => {
        User.findOne.mockResolvedValue({});
        sendEmail.mockImplementation(() => {});
        const spyStatus = jest.spyOn(res, "status");
        const spySend = jest.spyOn(res, "send");

        await getPasswordResetLink(req, res);

        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(spyStatus).toHaveBeenCalledTimes(1);
        expect(spyStatus).toHaveBeenCalledWith(200);
        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            status: "ok",
        });
    });
});

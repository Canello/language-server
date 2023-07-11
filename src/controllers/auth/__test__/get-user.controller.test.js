const { getUser } = require("../get-user.controller");
const User = require("../../../models/user.model");

jest.mock("../../../models/user.model");

describe("get-user.controller", () => {
    const req = {
        headers: {
            userId: "124",
        },
    };
    const res = {
        send: (r) => r,
    };

    it("throws an error if the user doesn't exist", async () => {
        User.findById.mockResolvedValue(null);

        await expect(getUser(req, res)).rejects.toThrow();
    });
});

const getUser = require("../get-user.controller");
const fs = require("fs");

describe("get-user.controller", () => {
    it("throws an error if the user doesn't exist", async () => {
        const req = {
            headers: { userId: "124" },
        };

        // try {
        // } catch (err) {}
    });
});

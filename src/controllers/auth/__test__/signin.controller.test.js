const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");
const User = require("../../../models/user.model");
const { signin } = require("../signin.controller");

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");
jest.mock("../../../models/user.model");

describe("signin.controller", () => {
    const req = {
        body: {
            email: "test@test.com",
            password: "something",
        },
    };
    const res = {
        send: () => {},
    };

    it("should throw error if user does not exist", async () => {
        jest.spyOn(User, "findOne").mockReturnValue(null);

        await expect(async () => {
            await signin(req, res);
        }).rejects.toThrow(new InvalidInputError("Usuário não encontrado."));
    });

    it("should throw error if password provided does not match", async () => {
        jest.spyOn(User, "findOne").mockReturnValue({
            password: "some-password",
        });
        jest.spyOn(bcrypt, "compare").mockReturnValue(false);

        await expect(async () => {
            await signin(req, res);
        }).rejects.toThrow(new InvalidInputError("Senha incorreta."));
    });

    it("should generate jwt with user id if both email and password are ok", async () => {
        const userId = "3095yj";

        jest.spyOn(User, "findOne").mockReturnValue({
            _id: userId,
            password: "some-password",
        });
        jest.spyOn(bcrypt, "compare").mockReturnValue(true);
        const spySign = jest.spyOn(jwt, "sign");

        await signin(req, res);

        expect(spySign).toHaveBeenCalledTimes(1);
        expect(spySign).toHaveBeenCalledWith(
            { userId: userId },
            expect.anything()
        );
    });

    it("should respond properly if both email and password are ok", async () => {
        const user = {
            _id: "3095yj",
            password: "some-password",
        };
        const userToken = "304j";

        jest.spyOn(User, "findOne").mockReturnValue(user);
        jest.spyOn(bcrypt, "compare").mockReturnValue(true);
        jest.spyOn(jwt, "sign").mockReturnValue(userToken);
        spySend = jest.spyOn(res, "send");

        await signin(req, res);

        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            data: { token: userToken, user },
        });
    });
});

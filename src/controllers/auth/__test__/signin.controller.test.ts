import { signin } from "../signin.controller";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { InvalidInputError } from "../../../errors/invalid-input-error.error";
import User from "../../../models/user.model";

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");
jest.mock("../../../models/user.model");

describe("signin.controller", () => {
    const req = {
        body: {
            email: "test@test.com",
            password: "something",
        },
    } as any;
    const res = {
        send: () => {},
    } as any;
    const next = (() => {}) as any;

    it("should throw error if user does not exist", async () => {
        jest.spyOn(User, "findOne").mockReturnValue(null as any);

        await expect(async () => {
            await signin(req, res, next);
        }).rejects.toThrow(new InvalidInputError("Usuário não encontrado."));
    });

    it("should throw error if password provided does not match", async () => {
        jest.spyOn(User, "findOne").mockReturnValue({
            password: "some-password",
        } as any);
        jest.spyOn(bcrypt, "compare").mockReturnValue(false as any);

        await expect(async () => {
            await signin(req, res, next);
        }).rejects.toThrow(new InvalidInputError("Senha incorreta."));
    });

    it("should generate jwt with user id if both email and password are ok", async () => {
        const userId = "3095yj";

        jest.spyOn(User, "findOne").mockReturnValue({
            _id: userId,
            password: "some-password",
        } as any);
        jest.spyOn(bcrypt, "compare").mockReturnValue(true as any);
        const spySign = jest.spyOn(jwt, "sign");

        await signin(req, res, next);

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

        jest.spyOn(User, "findOne").mockReturnValue(user as any);
        jest.spyOn(bcrypt, "compare").mockReturnValue(true as any);
        jest.spyOn(jwt, "sign").mockReturnValue(userToken as any);
        const spySend = jest.spyOn(res, "send");

        await signin(req, res, next);

        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            data: { token: userToken, user },
        });
    });
});

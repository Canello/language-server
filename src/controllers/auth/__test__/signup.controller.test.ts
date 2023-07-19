import { signup } from "../signup.controller";
import jwt from "jsonwebtoken";
import { InvalidInputError } from "../../../errors/invalid-input-error.error";
import User from "../../../models/user.model";

jest.mock("jsonwebtoken");
jest.mock("../../../models/user.model");

describe("signup.controller", () => {
    const makeReq = () => {
        return {
            body: {
                fullName: "Some Name",
                email: "test@test.com",
                password: "something",
            },
        } as any;
    };
    let req: any;
    const res = {
        send: () => {},
    } as any;
    const next = (() => {}) as any;

    beforeEach(() => {
        req = makeReq();
    });

    it("should throw an error if name is less than 1 character long", async () => {
        req.body.fullName = "";

        await expect(async () => {
            await signup(req, res, next);
        }).rejects.toThrow(
            new InvalidInputError("O nome deve ter no mínimo 1 caracter.")
        );
    });

    it("should throw an error if name is more than 100 characters long", async () => {
        req.body.fullName =
            "oiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdoboiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdob";

        await expect(async () => {
            await signup(req, res, next);
        }).rejects.toThrow(
            new InvalidInputError("O nome deve ter no máximo 100 caracteres.")
        );
    });

    it("should throw an error if email is invalid", async () => {
        req.body.email = "idfjosk";

        await expect(async () => {
            await signup(req, res, next);
        }).rejects.toThrow(new InvalidInputError("Email inválido."));
    });

    it("should throw an error if password is less then 8 characters long", async () => {
        req.body.password = "1234567";

        await expect(async () => {
            await signup(req, res, next);
        }).rejects.toThrow(
            new InvalidInputError("A senha deve ter no mínimo 8 caracteres.")
        );
    });

    it("should throw an error if password is more then 50 characters long", async () => {
        req.body.password =
            "oiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdoboiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdob";

        await expect(async () => {
            await signup(req, res, next);
        }).rejects.toThrow(
            new InvalidInputError("A senha deve ter no máximo 50 caracteres.")
        );
    });

    it("should throw an error if there is already a user using the email provided", async () => {
        jest.spyOn(User, "findOne").mockReturnValue({} as any);

        await expect(async () => {
            await signup(req, res, next);
        }).rejects.toThrow(
            new InvalidInputError("Já existe um usuário com esse email.")
        );
    });

    it("should respond properly if the inputs are correct and the email is not in use", async () => {
        const user = { _id: "98hijom" };
        const userToken = "u89i";

        jest.spyOn(User, "findOne").mockReturnValue(null as any);
        jest.spyOn(User.prototype, "save").mockReturnValue(user);
        jest.spyOn(jwt, "sign").mockReturnValue(userToken as any);
        const spySend = jest.spyOn(res, "send");

        await signup(req, res, next);

        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            data: { token: userToken, user },
        });
    });
});

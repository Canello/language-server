const jwt = require("jsonwebtoken");
const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");
const User = require("../../../models/user.model");
const { signup } = require("../signup.controller");

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
        };
    };
    const res = {
        send: () => {},
    };
    let req;

    beforeEach(() => {
        req = makeReq();
    });

    it("should throw an error if name is less than 1 character long", async () => {
        req.body.fullName = "";

        await expect(async () => {
            await signup(req, res);
        }).rejects.toThrow(
            new InvalidInputError("O nome deve ter no mínimo 1 caracter.")
        );
    });

    it("should throw an error if name is more than 100 characters long", async () => {
        req.body.fullName =
            "oiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdoboiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdob";

        await expect(async () => {
            await signup(req, res);
        }).rejects.toThrow(
            new InvalidInputError("O nome deve ter no máximo 100 caracteres.")
        );
    });

    it("should throw an error if email is invalid", async () => {
        req.body.email = "idfjosk";

        await expect(async () => {
            await signup(req, res);
        }).rejects.toThrow(new InvalidInputError("Email inválido."));
    });

    it("should throw an error if password is less then 8 characters long", async () => {
        req.body.password = "1234567";

        await expect(async () => {
            await signup(req, res);
        }).rejects.toThrow(
            new InvalidInputError("A senha deve ter no mínimo 8 caracteres.")
        );
    });

    it("should throw an error if password is more then 50 characters long", async () => {
        req.body.password =
            "oiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdoboiewjgoirejgoierjgmfkvmfdbdfkobfdkobkdfobkodfbkodfokbfdob";

        await expect(async () => {
            await signup(req, res);
        }).rejects.toThrow(
            new InvalidInputError("A senha deve ter no máximo 50 caracteres.")
        );
    });

    it("should throw an error if there is already a user using the email provided", async () => {
        jest.spyOn(User, "findOne").mockReturnValue({});

        await expect(async () => {
            await signup(req, res);
        }).rejects.toThrow(
            new InvalidInputError("Já existe um usuário com esse email.")
        );
    });

    it("should respond properly if the inputs are correct and the email is not in use", async () => {
        const user = { _id: "98hijom" };
        const userToken = "u89i";

        jest.spyOn(User, "findOne").mockReturnValue(null);
        jest.spyOn(User.prototype, "save").mockReturnValue(user);
        jest.spyOn(jwt, "sign").mockReturnValue(userToken);
        const spySend = jest.spyOn(res, "send");

        await signup(req, res);

        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            data: { token: userToken, user },
        });
    });
});

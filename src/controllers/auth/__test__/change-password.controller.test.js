const { changePassword } = require("../change-password.controller");
const { ExpiredError } = require("../../../errors/expired-error.error");
const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");
const User = require("../../../models/user.model");

jest.mock("../../../models/user.model");

describe("change-password.controller", () => {
    const req = {
        body: {
            newPassword: "something",
            token: "something",
        },
    };
    const res = {
        status: function (statusCode) {
            return this;
        },
        send: (r) => r,
    };

    it("throws if password is less than 8 characters long", async () => {
        const req = {
            body: {
                newPassword: "1234567",
                token: "something",
            },
        };

        await expect(changePassword(req, res)).rejects.toThrow(
            new InvalidInputError("A senha deve ter no mínimo 8 caracteres.")
        );
    });

    it("throws if password is greater than 50 characters long", async () => {
        const req = {
            body: {
                newPassword:
                    "123456789012345678901234567890123456789012345678901",
                token: "something",
            },
        };

        await expect(changePassword(req, res)).rejects.toThrow(
            new InvalidInputError("A senha deve ter no máximo 50 caracteres.")
        );
    });

    it("throws if jwt is expired", async () => {
        const req = {
            body: {
                newPassword: "something",
                // Esse token é válido, mas está expirado
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODgxNDcyMDQsImV4cCI6MTY4ODE0ODQwNH0.GT1TQgnhF0OKJXrClSlFV0OeJqzH4CqH9oj9ZKGmMGs",
            },
        };

        await expect(changePassword(req, res)).rejects.toThrow(
            new ExpiredError(
                "Esse link para redefinir senha expirou ou é inválido. Solicite outro."
            )
        );
    });

    it("throws if jwt is invalid", async () => {
        await expect(changePassword(req, res)).rejects.toThrow(
            new ExpiredError(
                "Esse link para redefinir senha expirou ou é inválido. Solicite outro."
            )
        );
    });

    it("tries to update the password properly if jwt and password are both ok", async () => {
        const req = {
            body: {
                newPassword: "something",
                // Esse token é válido e não tem data para expirar
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODgxNDcyMDR9.DepWv1vKrqReUCCPykbpH6z-6qBz15Jba1eYNk7fWYU",
            },
        };

        await changePassword(req, res);
        const hashedPassword = User.updateOne.mock.calls[0][1].password;

        expect(hashedPassword).not.toEqual(req.body.newPassword);
        expect(User.updateOne).toHaveBeenCalledTimes(1);
    });

    it("reponds properly if jwt and password are both ok", async () => {
        const req = {
            body: {
                newPassword: "something",
                // Esse token é válido e não tem data para expirar
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODgxNDcyMDR9.DepWv1vKrqReUCCPykbpH6z-6qBz15Jba1eYNk7fWYU",
            },
        };
        const spyStatus = jest.spyOn(res, "status");
        const spySend = jest.spyOn(res, "send");

        await changePassword(req, res);

        expect(spyStatus).toHaveBeenCalledTimes(1);
        expect(spyStatus).toHaveBeenCalledWith(200);
        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            status: "ok",
        });
    });
});

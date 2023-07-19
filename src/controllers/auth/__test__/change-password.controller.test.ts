import { changePassword } from "../change-password.controller";
import { ExpiredError } from "../../../errors/expired-error.error";
import { InvalidInputError } from "../../../errors/invalid-input-error.error";
import User from "../../../models/user.model";

jest.mock("../../../models/user.model");

describe("change-password.controller", () => {
    const req = {
        body: {
            newPassword: "something",
            token: "something",
        },
    } as any;
    const res = {
        status: function (statusCode: number) {
            return this;
        },
        send: (r: any) => r,
    } as any;
    const next = (() => {}) as any;

    it("throws if password is less than 8 characters long", async () => {
        const req = {
            body: {
                newPassword: "1234567",
                token: "something",
            },
        } as any;

        await expect(changePassword(req, res, next)).rejects.toThrow(
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
        } as any;

        await expect(changePassword(req, res, next)).rejects.toThrow(
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
        } as any;

        await expect(changePassword(req, res, next)).rejects.toThrow(
            new ExpiredError(
                "Esse link para redefinir senha expirou ou é inválido. Solicite outro."
            )
        );
    });

    it("throws if jwt is invalid", async () => {
        await expect(changePassword(req, res, next)).rejects.toThrow(
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
        } as any;

        await changePassword(req, res, next);
        const hashedPassword = (User.updateOne as jest.Mock).mock.calls[0][1]
            .password;

        expect(hashedPassword).not.toEqual(req.body.newPassword);
        expect(User.updateOne).toHaveBeenCalledTimes(1);
    });

    it("responds properly if jwt and password are both ok", async () => {
        const req = {
            body: {
                newPassword: "something",
                // Esse token é válido e não tem data para expirar
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODgxNDcyMDR9.DepWv1vKrqReUCCPykbpH6z-6qBz15Jba1eYNk7fWYU",
            },
        } as any;
        const spyStatus = jest.spyOn(res, "status");
        const spySend = jest.spyOn(res, "send");

        await changePassword(req, res, next);

        expect(spyStatus).toHaveBeenCalledTimes(1);
        expect(spyStatus).toHaveBeenCalledWith(200);
        expect(spySend).toHaveBeenCalledTimes(1);
        expect(spySend).toHaveBeenCalledWith({
            status: "ok",
        });
    });
});

import { getUser } from "../get-user.controller";
import User from "../../../models/user.model";
import { NotFoundError } from "../../../errors/not-found-error.error";

jest.mock("../../../models/user.model");

describe("get-user.controller", () => {
    const req = {
        headers: {
            userId: "124",
        },
    } as any;
    const res = {
        send: (r: any) => r,
    } as any;
    const next = (() => {}) as any;

    it("throws an error if user doesn't exist", async () => {
        (User.findById as jest.Mock).mockResolvedValue(null);

        await expect(getUser(req, res, next)).rejects.toThrow(
            new NotFoundError("Usuário não encontrado.")
        );
    });
});

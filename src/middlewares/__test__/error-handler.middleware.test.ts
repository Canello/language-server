import fs from "fs";
import { errorHandler } from "../error-handler.middleware";
import { NotFoundError } from "../../errors/not-found-error.error";

describe("error-handler.middleware", () => {
    const err = new Error();
    const req = {
        file: {
            filename: "something.wav",
        },
    } as any;
    const res = {
        status: function () {
            return this;
        },
        send: (r: any) => r,
    } as any;
    const next = (() => {}) as any;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("tries to delete the audio file that was uploaded by the request", async () => {
        const spyUnlink = jest
            .spyOn(fs.promises, "unlink")
            .mockImplementation((() => {}) as any);

        await errorHandler(err, req, res, next);

        expect(spyUnlink).toHaveBeenCalledTimes(1);
    });

    it("does not throw when audio file provided is invalid", async () => {
        const spyUnlink = jest
            .spyOn(fs.promises, "unlink")
            .mockImplementation((() => {}) as any);

        await expect(errorHandler(err, req, res, next)).resolves.not.toThrow();
        expect(spyUnlink).toHaveBeenCalledTimes(1);
    });

    it("responds with a default error response if a non CustomError is received", async () => {
        const spyRes = jest.spyOn(res, "send");
        const defaultResponse = {
            error: {
                type: "default",
                message: "Alguma coisa deu errado.",
            },
        };

        await errorHandler(err, req, res, next);

        expect(spyRes).toHaveReturnedWith(defaultResponse);
    });

    it("responds with a custom error response if an instance of CustomError is received", async () => {
        const err = new NotFoundError("Um erro customizado.");
        const spySend = jest.spyOn(res, "send");
        const expectedRes = {
            error: {
                type: "not_found",
                message: "Um erro customizado.",
            },
        };

        await errorHandler(err, req, res, next);

        expect(spySend).toHaveReturnedWith(expectedRes);
    });
});

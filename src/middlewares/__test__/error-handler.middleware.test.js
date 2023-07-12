const fs = require("fs");
const { errorHandler } = require("../error-handler.middleware");
const { NotFoundError } = require("../../errors/not-found-error.error");

describe("error-handler.middleware", () => {
    const err = new Error();
    const req = {
        file: {
            filename: "something.wav",
        },
    };
    const res = {
        status: function () {
            return this;
        },
        send: (r) => r,
    };

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("tries to delete the audio file that was uploaded by the request", async () => {
        const spyUnlink = jest
            .spyOn(fs.promises, "unlink")
            .mockImplementation(() => {});

        await errorHandler(err, req, res);

        expect(spyUnlink).toHaveBeenCalledTimes(1);
    });

    it("does not throw when audio file provided is invalid", async () => {
        const spyUnlink = jest
            .spyOn(fs.promises, "unlink")
            .mockImplementation(() => {});

        await expect(errorHandler(err, req, res)).resolves.not.toThrow();
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

        await errorHandler(err, req, res);

        expect(spyRes).toHaveReturnedWith(defaultResponse);
    });

    it("responds with a custom error response if an instance of CustomError is received", async () => {
        const err = new NotFoundError();
        const spySend = jest.spyOn(res, "send");
        const expectedRes = {
            error: {
                type: "not_found",
                message: "Não encontrado.",
            },
        };

        await errorHandler(err, req, res);

        expect(spySend).toHaveReturnedWith(expectedRes);
    });
});

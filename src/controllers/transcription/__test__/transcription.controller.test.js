const { transcription } = require("../transcription.controller");
const fs = require("fs");
const { UsageLimitError } = require("../../../errors/usage-limit-error.errors");
const {
    hasReachedMonthlyCostLimit,
} = require("../../../utils/functions/hasReachedMonthlyCostLimit");
const OpenAI = require("../../../models/openai.model");
const Usage = require("../../../models/usage.model");
const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");

jest.mock("fs", () => {
    return {
        readFileSync: () => {},
        promises: {
            unlink: () => {},
        },
    };
});
jest.mock("../../../utils/functions/hasReachedMonthlyCostLimit");
jest.mock("../../../models/openai.model");
jest.mock("../../../models/usage.model", () => {
    return class {
        constructor() {}

        save() {}
    };
});

describe("transcription.controller", () => {
    const makeReq = () => {
        return {
            headers: {
                userId: "09ik",
            },
            file: {
                filename: "some-filename.wav",
                size: 1 * 10 ** 6, // ~ 1 MB
            },
        };
    };
    const req = makeReq();
    const res = {
        send: () => {},
    };

    beforeEach(() => {
        hasReachedMonthlyCostLimit.mockImplementation(() => false);
    });

    it("should throw an error if user has reached monthly usage limit", async () => {
        hasReachedMonthlyCostLimit.mockImplementation(() => true);

        await expect(async () => {
            await transcription(req, res);
        }).rejects.toThrow(new UsageLimitError());
    });

    it("should throw an error if audio is larger than ~ 7 minutes", async () => {
        const req = makeReq();
        req.file.size = 10 * 10 ** 6; // ~ 10 MB

        await expect(async () => {
            await transcription(req, res);
        }).rejects.toThrow(
            new InvalidInputError("O áudio deve ser menor que 7 minutos.")
        );
    });

    it("should call OpenAI, track usage and delete temporary audio file", async () => {
        const spyTranscription = jest.spyOn(OpenAI, "transcript");
        const spySave = jest.spyOn(Usage.prototype, "save");
        const spyUnlink = jest.spyOn(fs.promises, "unlink");

        await transcription(req, res);

        expect(spySave).toHaveBeenCalledTimes(1);
        expect(spyTranscription).toHaveBeenCalledTimes(1);
        expect(spyUnlink).toHaveBeenCalledTimes(1);
    });
});

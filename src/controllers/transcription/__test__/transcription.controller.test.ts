import { transcription } from "../transcription.controller";
import fs from "fs";
import { UsageLimitError } from "../../../errors/usage-limit-error.errors";
import { hasReachedMonthlyCostLimit } from "../../../utils/functions/hasReachedMonthlyCostLimit";
import OpenAI from "../../../models/openai.model";
import Usage from "../../../models/usage.model";
import { InvalidInputError } from "../../../errors/invalid-input-error.error";

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
        } as any;
    };
    const req = makeReq();
    const res = {
        send: () => {},
    } as any;
    const next = (() => {}) as any;

    beforeEach(() => {
        (hasReachedMonthlyCostLimit as jest.Mock).mockImplementation(
            () => false
        );
    });

    it("should throw an error if user has reached monthly usage limit", async () => {
        (hasReachedMonthlyCostLimit as jest.Mock).mockImplementation(
            () => true
        );

        await expect(async () => {
            await transcription(req, res, next);
        }).rejects.toThrow(new UsageLimitError());
    });

    it("should throw an error if audio is larger than ~ 7 minutes", async () => {
        const req = makeReq();
        req.file.size = 10 * 10 ** 6; // ~ 10 MB

        await expect(async () => {
            await transcription(req, res, next);
        }).rejects.toThrow(
            new InvalidInputError("O áudio deve ser menor que 7 minutos.")
        );
    });

    it("should call OpenAI, track usage and delete temporary audio file", async () => {
        const spyTranscription = jest.spyOn(OpenAI, "transcript");
        const spySave = jest.spyOn(Usage.prototype, "save");
        const spyUnlink = jest.spyOn(fs.promises, "unlink");

        await transcription(req, res, next);

        expect(spySave).toHaveBeenCalledTimes(1);
        expect(spyTranscription).toHaveBeenCalledTimes(1);
        expect(spyUnlink).toHaveBeenCalledTimes(1);
    });
});

const { chat } = require("../chat.controller");
const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");
const { UsageLimitError } = require("../../../errors/usage-limit-error.errors");
const {
    hasReachedMonthlyCostLimit,
} = require("../../../utils/functions/hasReachedMonthlyCostLimit");
const OpenAI = require("../../../models/openai.model");
const Usage = require("../../../models/usage.model");

jest.mock("../../../models/usage.model");
jest.mock("../../../utils/functions/hasReachedMonthlyCostLimit");
jest.mock("../../../models/openai.model", () => {
    return {
        chat: () => {
            return {
                reply: "something",
                promptTokens: 5,
                completionTokens: 5,
                totalTokens: 10,
            };
        },
    };
});
jest.mock("../../../models/usage.model", () => {
    return class {
        constructor() {}

        save() {}
    };
});

describe("chat.controller", () => {
    const makeReq = () => {
        return {
            headers: {
                userId: "09ik",
            },
            body: {
                messages: [
                    { role: "user", content: "something" },
                    { role: "assistant", content: "something" },
                ],
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

    it("should throw an error if messages has more than 16 items", async () => {
        const req = makeReq();
        req.body.messages = [];
        for (let i = 0; i < 17; i++) {
            req.body.messages.push({});
        }

        await expect(async () => {
            await chat(req, res);
        }).rejects.toThrow(
            new InvalidInputError(
                "Você passou do limite de mensagens para uma requisição."
            )
        );
    });

    it("should throw an error if user has reached monthly usage limit", async () => {
        hasReachedMonthlyCostLimit.mockImplementation(() => true);

        await expect(async () => {
            await chat(req, res);
        }).rejects.toThrow(new UsageLimitError());
    });

    it("should call OpenAI API and track usage", async () => {
        const spyChat = jest.spyOn(OpenAI, "chat");
        const spySave = jest.spyOn(Usage.prototype, "save");

        await chat(req, res);

        expect(spySave).toHaveBeenCalledTimes(1);
        expect(spyChat).toHaveBeenCalledTimes(1);
    });
});

const {
    InvalidInputError,
} = require("../../../errors/invalid-input-error.error");
const { chat } = require("../chat.controller");

describe("chat.controller", () => {
    const makeReq = () => {
        return {
            headers: {
                userId: "09ik",
            },
            body: {
                messages: [{}, {}],
            },
        };
    };
    const res = {
        send: () => {},
    };

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
});

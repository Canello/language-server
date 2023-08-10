import request from "supertest";
import { app } from "../../../app";
import User from "../../../models/user.model";
import OpenAI from "../../../models/openai.model";

jest.mock("../../../models/openai.model", () => {
    return {
        chat: jest.fn(() => {}),
    };
});

const route = "/chat";

const makeMessages = (n: number = 14) => {
    const messages: Array<{ role: string; content: string }> = [];

    for (let i = 0; i < n; i++) {
        const message = {
            role: i % 2 === 0 ? "user" : "assistant",
            content: `Message ${i}`,
        };

        messages.push(message);
    }

    return messages;
};

describe(route, () => {
    let userToken: string, userId: string;

    beforeEach(async () => {
        (OpenAI.chat as jest.Mock).mockImplementation(() => {
            return {
                reply: "Some reply",
                promptTokens: 500,
                completionTokens: 700,
                totalTokens: 1200,
            };
        });

        const response = await request(app)
            .post("/auth/signup")
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);

        userToken = response.body.data.token;
        userId = response.body.data.user._id;
    });

    it("should respond with 200 if user still has free trials left", async () => {
        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(),
            })
            .expect(200);
    });

    it("should respond with 200 if user does not has free trials left but is active", async () => {
        for (let i = 0; i < 20; i++) {
            await request(app)
                .post(route)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    messages: makeMessages(),
                })
                .expect(200);
        }

        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        await User.updateOne({ _id: userId }, { expiresAt });

        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(),
            })
            .expect(200);
    });

    it("should respond with 403 if user has no free trials left and is not active", async () => {
        for (let i = 0; i < 20; i++) {
            await request(app)
                .post(route)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    messages: makeMessages(),
                })
                .expect(200);
        }

        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(),
            })
            .expect(403);
    });

    it("should respond with 403 if user has exceeded the monthly usage limit", async () => {
        (OpenAI.chat as jest.Mock).mockImplementation(() => {
            return {
                reply: "Some reply",
                promptTokens: 500 * 10 ** 8,
                completionTokens: 700 * 10 ** 8,
                totalTokens: 1200 * 10 ** 8,
            };
        });

        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        await User.updateOne({ _id: userId }, { expiresAt });

        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(),
            })
            .expect(200);

        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(),
            })
            .expect(403);
    });

    it("should respond with 400 with more than 16 messages", async () => {
        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(17),
            })
            .expect(400);
    });

    it("should respond with 401 with invalid user jwt", async () => {
        await request(app)
            .post(route)
            .set("Authorization", "Bearer some-invalid-jwt")
            .send({
                messages: makeMessages(),
            })
            .expect(401);
    });
});

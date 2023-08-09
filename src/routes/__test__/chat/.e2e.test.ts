import request from "supertest";
import { app } from "../../../app";
import OpenAI from "../../../models/openai.model";
import User from "../../../models/user.model";

jest.mock("../../../models/openai.model", () => {
    return {
        chat: () => {
            return {
                reply: "Some reply",
                promptTokens: 10,
                completionTokens: 20,
                totalTokens: 30,
            };
        },
    };
});

const route = "/chat";

const makeMessages = (n: number) => {
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
                messages: makeMessages(14),
            })
            .expect(200);
    });

    it("should respond with 200 if user does not has free trials left but is active", async () => {
        for (let i = 0; i < 20; i++) {
            await request(app)
                .post(route)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    messages: makeMessages(14),
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
                messages: makeMessages(14),
            })
            .expect(200);
    });

    it("should respond with 403 when there is no free trials left and user is not active", async () => {
        for (let i = 0; i < 20; i++) {
            await request(app)
                .post(route)
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    messages: makeMessages(14),
                })
                .expect(200);
        }

        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                messages: makeMessages(14),
            })
            .expect(403);
    });

    it("should respond with 401 with invalid user jwt", async () => {
        await request(app)
            .post(route)
            .set("Authorization", "Bearer some-invalid-jwt")
            .send({
                messages: makeMessages(14),
            })
            .expect(401);
    });
});

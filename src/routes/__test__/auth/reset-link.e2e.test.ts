import request from "supertest";
import { app } from "../../../app";

jest.mock("../../../utils/functions/sendEmail");

const route = "/auth/reset-link";

describe(route, () => {
    it("should respond with 200 on successful signin", async () => {
        await request(app)
            .post("/auth/signup")
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);

        await request(app)
            .post(route)
            .send({ email: "someemail@test.com" })
            .expect(200);
    });

    it("should respond with 400 with email that does not belong to any user", async () => {
        await request(app)
            .post(route)
            .send({ email: "someemail@test.com" })
            .expect(400);
    });
});

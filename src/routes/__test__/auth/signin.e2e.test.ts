import request from "supertest";
import { app } from "../../../app";

const route = "/auth/signin";

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
            .send({
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(200);
    });

    it("should respond with a 400 if user does not exist", async () => {
        return request(app)
            .post(route)
            .send({
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(400);
    });

    it("should respond with 400 with invalid password", async () => {
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
            .send({
                email: "someemail@test.com",
                password: "wrong-password",
            })
            .expect(400);
    });
});

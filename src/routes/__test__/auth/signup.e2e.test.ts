import request from "supertest";
import { app } from "../../../app";

const route = "/auth/signup";

describe(route, () => {
    it("should respond with a 201 on successful signup", async () => {
        return request(app)
            .post(route)
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);
    });

    it("should respond with a 400 with an empty full name", async () => {
        return request(app)
            .post(route)
            .send({
                fullName: "",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(400);
    });

    it("should respond with a 400 with an invalid email", async () => {
        await request(app)
            .post(route)
            .send({
                fullName: "Some Name",
                email: "someemailtest",
                password: "12345678",
            })
            .expect(400);

        await request(app)
            .post(route)
            .send({
                fullName: "Some Name",
                email: "",
                password: "12345678",
            })
            .expect(400);
    });

    it("should respond with 400 with an invalid password", async () => {
        await request(app)
            .post(route)
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "1234567",
            })
            .expect(400);
    });

    it("should respond with 400 if email is already in use", async () => {
        await request(app)
            .post(route)
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);

        await request(app)
            .post(route)
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(400);
    });
});

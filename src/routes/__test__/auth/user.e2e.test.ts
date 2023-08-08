import request from "supertest";
import { app } from "../../../app";

const route = "/auth/user";

describe(route, () => {
    it("should respond with 200 with valid token", async () => {
        const response = await request(app)
            .post("/auth/signup")
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);

        const userToken = response.body.data.token;
        console.log(response.body.data);

        await request(app)
            .get(route)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
    });

    it("should respond with a 401 with invalid jwt", async () => {
        await request(app)
            .get(route)
            .set("Authorization", `Bearer some-invalid-token`)
            .expect(401);
    });

    it("should respond with a 404 with valid jwt but inexistent user", async () => {
        await request(app)
            .get(route)
            .set(
                "Authorization",
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQyNThlZjVlMDhkODUxZTFiOTZkNTYiLCJpYXQiOjE2OTE1MDY5Mjd9.-rc6_T7QbY-6P7OzUCobGOiW7qc4o13t5168FQwV3Pk`
            )
            .expect(404);
    });
});

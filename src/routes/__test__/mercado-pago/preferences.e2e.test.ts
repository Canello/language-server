import request from "supertest";
import { app } from "../../../app";

jest.mock("../../../models/marcado-pago.model", () => {
    return {
        createPreference: () => {
            return { init_point: "https://somewhere.com/init_point" };
        },
    };
});

const route = "/mercado-pago/preferences";

describe(route, () => {
    it("should respond with 201 on successful preference creation", async () => {
        const response = await request(app)
            .post("/auth/signup")
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);

        const userToken = response.body.data.token;

        await request(app)
            .post(route)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(201);
    });

    it("should respond with 401 with invalid user jwt", async () => {
        await request(app)
            .post(route)
            .set("Authorization", `Bearer invalid-jwt`)
            .expect(401);
    });
});

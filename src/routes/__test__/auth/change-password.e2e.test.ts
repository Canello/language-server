import request from "supertest";
import { app } from "../../../app";
import { sendEmail } from "../../../utils/functions/sendEmail";

jest.mock("../../../utils/functions/sendEmail");

const route = "/auth/change-password";

describe(route, () => {
    let token: string;

    beforeEach(async () => {
        let resetLink: string;
        (sendEmail as jest.Mock).mockImplementation(({ to, url }) => {
            resetLink = url;
        });

        await request(app)
            .post("/auth/signup")
            .send({
                fullName: "Some Name",
                email: "someemail@test.com",
                password: "12345678",
            })
            .expect(201);

        await request(app)
            .post("/auth/reset-link")
            .send({ email: "someemail@test.com" })
            .expect(200);

        token = resetLink!.split("/")[resetLink!.split("/").length - 1];
    });

    it("should respond with 200 on successful password change", async () => {
        await request(app)
            .post(route)
            .send({
                newPassword: "87654321",
                token,
            })
            .expect(200);
    });

    it("should respond with 400 with invalid password", async () => {
        await request(app)
            .post(route)
            .send({
                newPassword: "1234567",
                token,
            })
            .expect(400);

        await request(app)
            .post(route)
            .send({
                newPassword:
                    "123456789012345678901234567890123456789012345678901",
                token,
            })
            .expect(400);
    });

    it("should respond with 400 with invalid jwt", async () => {
        await request(app)
            .post(route)
            .send({
                newPassword: "87654321",
                token: "invalid-jwt",
            })
            .expect(400);
    });
});

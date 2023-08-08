import request from "supertest";
import { app } from "../../../app";
import MercadoPago from "../../../models/marcado-pago.model";
import User from "../../../models/user.model";

const makeFindById = (isActive = false) => {
    return () => {
        return { isActive };
    };
};
const makeGetPayment =
    ({
        status = "approved",
        status_detail = "accredited",
        user_id = "some-user-id",
    }) =>
    () => {
        return {
            status,
            status_detail,
            metadata: {
                user_id,
            },
        };
    };

jest.mock("../../../models/marcado-pago.model");
jest.mock("../../../models/user.model");

const route = "/mercado-pago/webhooks";

describe(route, () => {
    it("should always respond with 200", async () => {
        (MercadoPago.getPayment as jest.Mock).mockImplementation(
            makeGetPayment({})
        );
        (User.findById as jest.Mock).mockImplementation(makeFindById());

        await request(app)
            .post(route)
            .send({
                data: { id: "some-payment-id" },
            })
            .expect(200);

        (User.findById as jest.Mock).mockImplementation(makeFindById(true));

        await request(app)
            .post(route)
            .send({
                data: { id: "some-payment-id" },
            })
            .expect(200);

        (MercadoPago.getPayment as jest.Mock).mockImplementation(
            makeGetPayment({
                status: "rejected",
                status_detail: "cc_rejected_other_reason",
            })
        );

        await request(app)
            .post(route)
            .send({
                data: { id: "some-payment-id" },
            })
            .expect(200);
    });
});

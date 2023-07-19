import { mercadopagoWebhook } from "../mercadopago-webhook.controller";
import MercadoPago from "../../../models/marcado-pago.model";
import User from "../../../models/user.model";

jest.mock("../../../models/marcado-pago.model", () => {
    return {
        getPayment: () => {
            return {
                status: "approved",
                status_detail: "accredited",
                metadata: {
                    user_id: "98ji",
                },
            };
        },
        refund: () => {},
    };
});
jest.mock("../../../models/user.model");

describe("mercadopago-webhook.controller", () => {
    const req = {
        body: {
            data: {
                id: "0j9i",
            },
        },
    } as any;
    const res = {
        status: function () {
            return this;
        },
        send: () => {},
    } as any;
    const next = (() => {}) as any;

    it("shoud not refund and not add access if payment is not approved or not accredited", async () => {
        const spyRefund = jest.spyOn(MercadoPago, "refund");

        jest.spyOn(MercadoPago, "getPayment").mockReturnValue(
            new Promise((resolve) =>
                resolve({
                    status: "rejected",
                    status_detail: "accredited",
                })
            )
        );

        await mercadopagoWebhook(req, res, next);

        jest.spyOn(MercadoPago, "getPayment").mockReturnValue(
            new Promise((resolve) =>
                resolve({
                    status: "approved",
                    status_detail: "cc_rejected_other_reason",
                })
            )
        );

        await mercadopagoWebhook(req, res, next);

        expect(spyRefund).not.toHaveBeenCalled();
        expect(User.updateOne).not.toHaveBeenCalled();
    });

    it("should refund if user is already active", async () => {
        const spyRefund = jest.spyOn(MercadoPago, "refund");
        jest.spyOn(User, "findById").mockReturnValue({ isActive: true } as any);

        await mercadopagoWebhook(req, res, next);

        expect(spyRefund).toHaveBeenCalledTimes(1);
    });

    it("should add 1 month access if user is not active", async () => {
        const spyUpdateOne = jest.spyOn(User, "updateOne");
        jest.spyOn(User, "findById").mockReturnValue({
            isActive: false,
        } as any);

        await mercadopagoWebhook(req, res, next);

        expect(spyUpdateOne).toHaveBeenCalledTimes(1);
    });
});

const MercadoPago = require("../../../models/marcado-pago.model");
const User = require("../../../models/user.model");
const { mercadopagoWebhook } = require("../mercadopago-webhook.controller");

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
    };
    const res = {
        status: function () {
            return this;
        },
        send: () => {},
    };

    it("shoud not refund and not add access if payment is not approved or not accredited", async () => {
        const spyRefund = jest.spyOn(MercadoPago, "refund");

        jest.spyOn(MercadoPago, "getPayment").mockReturnValue({
            status: "rejected",
            status_detail: "accredited",
        });

        await mercadopagoWebhook(req, res);

        jest.spyOn(MercadoPago, "getPayment").mockReturnValue({
            status: "approved",
            status_detail: "cc_rejected_other_reason",
        });

        await mercadopagoWebhook(req, res);

        expect(spyRefund).not.toHaveBeenCalled();
        expect(User.updateOne).not.toHaveBeenCalled();
    });

    it("should refund if user is already active", async () => {
        const spyRefund = jest.spyOn(MercadoPago, "refund");
        jest.spyOn(User, "findById").mockReturnValue({ isActive: true });

        await mercadopagoWebhook(req, res);

        expect(spyRefund).toHaveBeenCalledTimes(1);
    });

    it("should add 1 month access if user is not active", async () => {
        const spyUpdateOne = jest.spyOn(User, "updateOne");
        jest.spyOn(User, "findById").mockReturnValue({ isActive: false });

        await mercadopagoWebhook(req, res);

        expect(spyUpdateOne).toHaveBeenCalledTimes(1);
    });
});

import { createPreference } from "../create-preference.controller";
import MercadoPago from "../../../models/marcado-pago.model";

jest.mock("../../../models/marcado-pago.model");

describe("create-preference.controller", () => {
    const req = {
        headers: {
            userId: "09jhj",
        },
    } as any;
    const res = {
        status: function () {
            return this;
        },
        send: () => {},
    } as any;
    const next = (() => {}) as any;

    it("should call mercado pago API", async () => {
        const spyCreatePreference = jest
            .spyOn(MercadoPago, "createPreference")
            .mockReturnValue(
                new Promise((resolve) =>
                    resolve({ init_value: "some-site.com" })
                )
            );

        await createPreference(req, res, next);

        expect(spyCreatePreference).toHaveBeenCalledTimes(1);
    });
});

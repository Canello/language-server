const MercadoPago = require("../../../models/marcado-pago.model");
const { createPreference } = require("../create-preference.controller");

jest.mock("../../../models/marcado-pago.model");

describe("create-preference.controller", () => {
    const req = {
        headers: {
            userId: "09jhj",
        },
    };
    const res = {
        status: function () {
            return this;
        },
        send: () => {},
    };

    it("should call mercado pago API", async () => {
        const spyCreatePreference = jest
            .spyOn(MercadoPago, "createPreference")
            .mockReturnValue({ init_value: "some-site.com" });

        await createPreference(req, res);

        expect(spyCreatePreference).toHaveBeenCalledTimes(1);
    });
});

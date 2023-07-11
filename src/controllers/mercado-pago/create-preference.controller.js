const MercadoPago = require("../../models/marcado-pago.model");
const { makePreference } = require("../../utils/functions/makePreference");

exports.createPreference = async (req, res, next) => {
    const { userId } = req.headers;

    const preference = makePreference(userId);
    const createdPreference = await MercadoPago.createPreference(preference);

    res.status(201).send({
        status: "ok",
        data: {
            init_point: createdPreference.init_point,
        },
    });
};

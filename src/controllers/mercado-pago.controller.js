const User = require("../models/user.model");
const MercadoPago = require("../models/marcado-pago.model");
const { makePreference } = require("../utils/functions/makePreference");

// criar preferência exclusivamente para esse usuário com user_id no metadata
// enviar link da preferência para o front-end
// você tem 10min para pagar
// receber webhook com user_id

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

exports.mercadopagoWebhook = async (req, res, next) => {
    // Get payment by id
    const { id } = req.body.data;
    const payment = await MercadoPago.getPayment(id);
    console.log(payment);

    // Check if user is already active
    // If he is, give the money back

    if (
        payment.status === "approved" &&
        payment.status_detail === "accredited"
    ) {
        // Give 1 month access for user
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        console.log("wiil set expiration date " + expirationDate);
        console.log("for user with id", payment.metadata.user_id);
        User.updateOne({ _id: payment.metadata.user_id }, { expirationDate });
    }

    res.status(200).send("ok");
};

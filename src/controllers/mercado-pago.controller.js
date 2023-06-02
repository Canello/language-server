const axios = require("axios");

exports.mercadopagoWebhook = async (req, res, next) => {
    const { id } = req.body;

    const payment = await axios.get(
        "https://api.mercadopago.com/v1/payments/" + id
    );
    console.log("will print payment");
    console.log(payment);

    res.status(200).send("ok");
};

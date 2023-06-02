const axios = require("axios");

exports.mercadopagoWebhook = async (req, res, next) => {
    const { id } = req.body.data;

    console.log("payment id");
    console.log(id);
    console.log("https://api.mercadopago.com/v1/payments/" + id);

    const payment = await axios.get(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer " + process.env.MERCADO_PAGO_ACCESS_TOKEN,
            },
        }
    );
    console.log("will print payment");
    console.log(payment);

    res.status(200).send("ok");
};

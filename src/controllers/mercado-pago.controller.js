const axios = require("axios");
const mercadopago = require("mercadopago");
const User = require("../models/user.model");

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// criar preferência exclusivamente para esse usuário com user_id no metadata
// enviar link da preferência para o front-end
// receber webhook com user_id

exports.createPreference = async (req, res, next) => {
    const { userId } = req.headers;

    const preference = {
        expires: false,
        items: [
            {
                title: "1 mês de acesso à Caitlyn",
                description:
                    "1 mês de acesso para treinar conversação em inglês com a Caitlyn, a inteligência artificial.",
                picture_url:
                    "https://images.unsplash.com/photo-1633113215883-a43e36bc6178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
                category_id: "virtual_goods",
                quantity: 1,
                currency_id: "BRL",
                unit_price: 19.99,
            },
        ],
        back_urls: {
            success: "http://localhost:3000",
        },
        metadata: {
            user_id: userId,
        },
    };

    const response = await mercadopago.preferences.create(preference);
    // Este valor substituirá a string "<%= global.id %>" no seu HTML
    // global.id = response.body.id;

    res.send(response.body);
};

exports.mercadopagoWebhook = async (req, res, next) => {
    // Payment id
    const { id } = req.body.data;

    // Get payment
    const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer " + process.env.MERCADO_PAGO_ACCESS_TOKEN,
            },
        }
    );
    const payment = response.data;

    // Check if user is already active
    // If he is, give the money back

    if (
        payment.status === "approved" &&
        payment.status_detail === "accredited"
    ) {
        // Set 1 month access for user
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        User.updateOne({ _id: payment.metadata.user_id }, { expirationDate });
    }

    res.status(200).send("ok");
};

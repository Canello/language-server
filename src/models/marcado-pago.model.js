const axios = require("axios");

class MercadoPago {
    static async createPreference(preference) {
        const response = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            preference,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + process.env.MERCADO_PAGO_ACCESS_TOKEN,
                },
            }
        );

        return response.data;
    }

    static async getPayment(id) {
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

        return response.data;
    }

    static async refund(id) {
        const response = axios.post(
            `https://api.mercadopago.com/v1/payments/${id}/refunds`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + process.env.MERCADO_PAGO_ACCESS_TOKEN,
                    "X-Idempotency-Key": "77e1c83b-7bb0-437b-bc50-a7a58e5660ac",
                },
            }
        );

        return response.data;
    }
}

module.exports = MercadoPago;

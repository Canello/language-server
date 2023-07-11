const express = require("express");
const {
    createPreference,
} = require("../controllers/mercado-pago/create-preference.controller");
const {
    mercadopagoWebhook,
} = require("../controllers/mercado-pago/mercadopago-webhook.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/mercado-pago/preferences", auth, createPreference);
router.post("/mercado-pago/webhooks", mercadopagoWebhook);

module.exports = router;

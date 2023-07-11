const express = require("express");
const {
    createPreference,
    mercadopagoWebhook,
} = require("../controllers/mercado-pago.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/mercado-pago/preferences", auth, createPreference);
router.post("/mercado-pago/webhooks", mercadopagoWebhook);

module.exports = router;

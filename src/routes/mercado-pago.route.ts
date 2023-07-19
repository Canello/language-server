import express from "express";
import { createPreference } from "../controllers/mercado-pago/create-preference.controller";
import { mercadopagoWebhook } from "../controllers/mercado-pago/mercadopago-webhook.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/mercado-pago/preferences", auth, createPreference);
router.post("/mercado-pago/webhooks", mercadopagoWebhook);

export default router;

import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import MercadoPago from "../../models/marcado-pago.model";

export const mercadopagoWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.body.data;
    const payment = await MercadoPago.getPayment(id);

    if (
        payment.status === "approved" &&
        payment.status_detail === "accredited"
    ) {
        const userId = payment.metadata.user_id;
        const user = (await User.findById(userId))!;

        if (user.isActive) {
            // Se o usuário já estiver com conta ativa, reembolsá-lo
            await MercadoPago.refund(id);
        } else {
            // Liberar 1 mês de acesso para o usuário
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            await User.updateOne(
                { _id: payment.metadata.user_id },
                { expiresAt }
            );
        }
    }

    res.status(200).send({ status: "ok" });
};

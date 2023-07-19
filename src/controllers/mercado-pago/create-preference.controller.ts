import { Request, Response, NextFunction } from "express";
import MercadoPago from "../../models/marcado-pago.model";
import { makePreference } from "../../utils/functions/makePreference";

export const createPreference = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.headers as { userId: string };

    const preference = makePreference(userId);
    const createdPreference = await MercadoPago.createPreference(preference);

    res.status(201).send({
        status: "ok",
        data: {
            init_point: createdPreference.init_point,
        },
    });
};

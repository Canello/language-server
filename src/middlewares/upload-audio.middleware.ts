import { Request, Response, NextFunction } from "express";
import multer from "multer";
import * as uuid from "uuid";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb: Function) {
        cb(null, path.join(__dirname, "..", "..", "uploads"));
    },
    filename: function (req: Request, file, cb: Function) {
        cb(null, "audio" + uuid.v4() + ".wav");
    },
});

export const uploadAudio = multer({
    storage: storage,
    limits: { fileSize: 14 * 1000 * 1000 }, // Limitar áudios até 14MB
}).single("file");

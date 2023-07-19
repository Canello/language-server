import express from "express";
import { signin } from "../controllers/auth/signin.controller";
import { signup } from "../controllers/auth/signup.controller";
import { getUser } from "../controllers/auth/get-user.controller";
import { getPasswordResetLink } from "../controllers/auth/get-password-reset-link.controller";
import { changePassword } from "../controllers/auth/change-password.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/user", auth, getUser);
router.post("/reset-link", getPasswordResetLink);
router.post("/change-password", changePassword);

export default router;

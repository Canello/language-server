const express = require("express");
const { signin } = require("../controllers/auth/signin.controller");
const { signup } = require("../controllers/auth/signup.controller");
const { getUser } = require("../controllers/auth/get-user.controller");
const {
    getPasswordResetLink,
} = require("../controllers/auth/get-password-reset-link.controller");
const {
    changePassword,
} = require("../controllers/auth/change-password.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

// router.post("/auth/google", loginWithGoogle);
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/user", auth, getUser);
router.post("/reset-link", getPasswordResetLink);
router.post("/change-password", changePassword);

module.exports = router;

const express = require("express");
const {
    signin,
    signup,
    getUser,
    getPasswordResetLink,
    changePassword,
} = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

// app.post("/auth/google", loginWithGoogle);
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/user", auth, getUser);
router.post("/reset-link", getPasswordResetLink);
router.post("/change-password", changePassword);

module.exports = router;

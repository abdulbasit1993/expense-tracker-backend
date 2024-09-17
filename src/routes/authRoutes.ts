const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/auth/signup", authController.signup);

router.post("/auth/signin", authController.signin);

router.post("/auth/forgot-password", authController.sendEmailWithOTP);

router.post("/auth/validate-otp", authController.validateOTP);

router.post("/auth/reset-password", authController.resetPassword);

module.exports = router;

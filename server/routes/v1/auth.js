import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, verifyOtp, changePassword, sendOTPForRegistration, getUsers } from "../../controller/authController.js";
import { registerValidation, loginValidation, forgotPasswordValidation, changePasswordValidation } from "../../middleware/validationHandler.js";
import { verifyRecaptcha } from "../../middleware/recaptcha.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/send-otp", sendOTPForRegistration);
router.post("/register/verify-otp", verifyOtp);
router.post("/register", registerValidation, registerUser);

router.post("/login", verifyRecaptcha, loginValidation, loginUser);
router.post("/logout", tokenMiddleware, logoutUser);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/change-password", changePasswordValidation, changePassword);
router.get("/users", tokenMiddleware, getUsers);

export default router;

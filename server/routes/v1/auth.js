import express from "express";
import { verifyRecaptcha } from "../../middleware/recaptcha.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
import { validateRegistration, loginValidation, forgotPasswordValidation, changePasswordValidation } from "../../middleware/validationHandler.js";
import { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, verifyOtp, changePassword, sendOTPForRegistration, getUsers, approveUser, cancelApproval } from "../../controller/authController.js";

const router = express.Router();

router.post("/register/verify-otp", verifyOtp);
router.post("/register/send-otp", sendOTPForRegistration);
router.post("/register", validateRegistration, registerUser);

router.post("/refresh", refreshToken);
router.post("/login", verifyRecaptcha, loginValidation, loginUser);
router.post("/logout", tokenMiddleware, logoutUser);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/change-password", changePasswordValidation, changePassword);

router.get("/users", tokenMiddleware, getUsers);

router.put("/approve/:userId", approveUser);
router.put("/cancel-approval/:userId", cancelApproval);

export default router;

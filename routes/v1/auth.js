import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, verifyOtp, changePassword, getAllUsers } from "../../controller/userController.js";
import { registerValidation, loginValidation, forgotPasswordValidation, changePasswordValidation } from "../../middleware/validationHandler.js";
import { verifyRecaptcha } from "../../middleware/recaptcha.js";
const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", verifyRecaptcha, loginValidation, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", changePasswordValidation, changePassword);
router.get("/users", getAllUsers);

export default router;

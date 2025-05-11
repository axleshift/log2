import express from "express";
import { verifyRecaptcha } from "../../middleware/recaptcha.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
import { validateRegistration, loginValidation, forgotPasswordValidation, changePasswordValidation } from "../../middleware/validationHandler.js";
import { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, verifyOtp, changePassword, sendOTPForRegistration, getUsers, approveUser, cancelApproval, verify2FA, registerVendor } from "../../controller/authController.js";
import { uploadVendorDocuments } from "../../utils/multer.js";

const router = express.Router();

router.post("/register/verify-otp", verifyOtp);
router.post("/register/send-otp", sendOTPForRegistration);
router.post("/register", validateRegistration, registerUser);
router.post("/register/vendor", validateRegistration, uploadVendorDocuments, registerVendor);

router.post("/refresh", refreshToken);
router.post("/login", verifyRecaptcha, loginValidation, loginUser);
router.post("/verify-2fa", verify2FA);
router.post("/logout", tokenMiddleware, logoutUser);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/change-password", changePasswordValidation, changePassword);

router.get("/users", tokenMiddleware, getUsers);
router.put("/approve/:userId", approveUser);
router.put("/cancel-approval/:userId", cancelApproval);

export default router;

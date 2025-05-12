import express from "express";
import { verifyRecaptcha } from "../../middleware/recaptcha.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";
import { validateRegistration, loginValidation, forgotPasswordValidation, changePasswordValidation } from "../../middleware/validationHandler.js";
import { registerUser, loginUser, logoutUser, refreshToken, forgotPassword, verifyOtp, changePassword, sendOTPForRegistration, getUsers, approveUser, cancelApproval, verify2FA, registerVendor } from "../../controller/authController.js";
import { uploadFile } from "../../utils/fileUpload.js";

const router = express.Router();

router.post("/register/verify-otp", verifyOtp);
router.post("/register/send-otp", sendOTPForRegistration);
router.post("/register", validateRegistration, registerUser);
router.post(
    "/register/vendor",
    validateRegistration,
    uploadFile.fields([
        { name: "businessRegistrationCertificate", maxCount: 1 },
        { name: "companyProfile", maxCount: 1 },
        { name: "isoCertification", maxCount: 1 },
        { name: "authorizationCertificate", maxCount: 1 },
        { name: "complianceDeclaration", maxCount: 1 },
        { name: "productCatalog", maxCount: 1 },
    ]),
    registerVendor
);

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

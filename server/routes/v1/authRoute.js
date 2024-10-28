import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    forgotPassword,
    verifyOtp,
    changePassword,
    getAllUsers,
} from "../../controller/userController.js";
import {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    changePasswordValidation,
} from "../../middleware/validationHandler.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 */
router.post("/register", registerValidation, registerUser);

/**
 * @route POST /api/users/login
 * @desc Login a user
 */
router.post("/login", loginValidation, loginUser);

/**
 * @route POST /api/users/logout
 * @desc Logout a user
 */
router.post("/logout", logoutUser);

/**
 * @route POST /api/users/refresh
 * @desc Refresh token
 */
router.post("/refresh", refreshToken);

/**
 * @route POST /api/users/forgot-password
 * @desc Generate OTP for password reset
 */
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

/**
 * @route POST /api/users/verify-otp
 * @desc Verify OTP for password reset
 */
router.post("/verify-otp", verifyOtp);

/**
 * @route POST /api/users/change-password
 * @desc Change user password
 */
router.post("/change-password", changePasswordValidation, changePassword);

router.get("/users", getAllUsers); 

export default router;

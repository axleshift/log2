import { body, validationResult } from "express-validator";

// Centralized error response
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "Validation errors", errors: errors.array() });
    }
    next();
};

// Register Validation
export const registerValidation = [
    body("email").isEmail().withMessage("Invalid email format."),
    body("username").isLength({ min: 5, max: 20 }).withMessage("Username must be between 5 and 20 characters."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
    handleValidationErrors,
];

// Login Validation
export const loginValidation = [body("username").notEmpty().withMessage("Username is required."), body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."), handleValidationErrors];

// Forgot Password Validation
export const forgotPasswordValidation = [body("email").isEmail().withMessage("Invalid email format."), handleValidationErrors];

// OTP Validation
export const otpValidation = [body("email").isEmail().withMessage("Invalid email format."), body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits."), handleValidationErrors];

// Change Password Validation
export const changePasswordValidation = [body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits."), body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters."), handleValidationErrors];

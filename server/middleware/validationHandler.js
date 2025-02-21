import { body, validationResult } from "express-validator";

// Centralized error response middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation errors",
            errors: errors.array(),
        });
    }
    next();
};

// Register Validation
export const validateRegistration = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").optional().isIn(["user", "admin", "super admin", "vendor", "buyer", "finance"]).withMessage("Invalid role"),

    // Vendor-specific validation (only if role is 'vendor')
    body("businessName").if(body("role").equals("vendor")).notEmpty().withMessage("Business Name is required"),
    body("fullName").if(body("role").equals("vendor")).notEmpty().withMessage("Full Name is required"),
    body("businessAddress").if(body("role").equals("vendor")).notEmpty().withMessage("Business Address is required"),
    body("contactNumber").if(body("role").equals("vendor")).notEmpty().withMessage("Contact Number is required"),
    body("taxId").if(body("role").equals("vendor")).notEmpty().withMessage("Tax ID is required"),
    body("certifications").if(body("role").equals("vendor")).notEmpty().withMessage("Certifications is required"),

    // Department-specific validation (only if department details are provided)
    body("departmentName").optional().notEmpty().withMessage("Department Name is required if provided"),
    body("departmentDescription").optional().notEmpty().withMessage("Department Description is required if provided"),
];

// Login Validation
export const loginValidation = [body("username").trim().notEmpty().withMessage("Username is required."), body("password").isString().withMessage("Password must be a string.").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."), handleValidationErrors];

// Forgot Password Validation
export const forgotPasswordValidation = [body("email").trim().isEmail().withMessage("Invalid email format."), handleValidationErrors];

// OTP Validation
export const otpValidation = [body("email").trim().isEmail().withMessage("Invalid email format."), body("otp").isString().withMessage("OTP must be a string.").isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits."), handleValidationErrors];

// Change Password Validation
export const changePasswordValidation = [
    body("otp").isString().withMessage("OTP must be a string.").isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits."),
    body("newPassword").isString().withMessage("New password must be a string.").isLength({ min: 6 }).withMessage("New password must be at least 6 characters."),
    handleValidationErrors,
];

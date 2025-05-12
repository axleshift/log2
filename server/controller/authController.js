import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { TokenService } from "../utils/tokenService.js";
import logger from "../utils/logger.js";
import { generateOtp, sendOtpEmail, storeOtp, getOtp, clearOtp } from "../utils/otpStore.js";
import { getAllUsers, findUserByEmail, findUserByUsername, createUser } from "./userController.js";
import VendorModel from "../models/vendor.js";
import UserModel from "../models/UserModel.js";
import { send2FACode } from "../utils/otpStore.js";

const pending2FA = new Map();

const handleError = (error, next, message) => {
    logger.error(message, { error: error.message, stack: error.stack });
    return next({ status: "error", message });
};

// Helper function to build the document URL
const buildDocumentUrl = (field, files, req) => {
    const file = files?.[field]?.[0];
    const protocol = process.env.NODE_ENV === "production" ? "https" : req.protocol;
    return file ? `${protocol}://${req.get("host")}/uploads/${file.filename}` : undefined;
};

export const sendOTPForRegistration = async (req, res, next) => {
    const { email } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email already in use" });
        }
        const otp = generateOtp();
        storeOtp(email, otp);
        await sendOtpEmail(email, otp);

        return res.status(200).json({ status: "success", message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// VERIFY REGISTRATION
export const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const storedOtp = getOtp(email);

        if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expires) {
            return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
        }
        clearOtp(email);

        return res.status(200).json({ status: "success", message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

export const registerUser = async (req, res, next) => {
    const { email, username, password, role } = req.body;

    const validRoles = ["staff", "admin", "super admin"];
    const userRole = validRoles.includes(role) ? role : "user";

    try {
        // Check if email or username is already in use
        const [existingUserByEmail, existingUserByUsername] = await Promise.all([findUserByEmail(email), findUserByUsername(username)]);

        if (existingUserByEmail || existingUserByUsername) {
            return res.status(400).json({ status: "error", message: "Email or username already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = await createUser({
            email,
            username,
            password: hashedPassword,
            role: userRole,
            status: "Active",
        });

        if (!newUser) {
            throw new Error("User creation failed");
        }

        // Generate tokens
        const accessToken = TokenService.generateAccessToken({ userId: newUser._id });
        const refreshToken = TokenService.generateRefreshToken({ userId: newUser._id });

        // Set refresh token in cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        // Respond with success
        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            accessToken,
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ status: "error", message: error.message });
    }
};

export const registerVendor = async (req, res, next) => {
    const { email, username, password, businessName, fullName, businessAddress, contactNumber, taxId, agreeToTerms, acceptNDA } = req.body;

    try {
        const [existingUserByEmail, existingUserByUsername] = await Promise.all([findUserByEmail(email), findUserByUsername(username)]);

        if (existingUserByEmail || existingUserByUsername) {
            return res.status(400).json({ status: "error", message: "Email or username already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await createUser({
            email,
            username,
            password: hashedPassword,
            role: "vendor",
            status: "Pending",
        });

        if (!newUser) throw new Error("User creation failed");

        // Build documents URLs using the helper function
        const documents = {
            businessRegistrationCertificate: buildDocumentUrl("businessRegistrationCertificate", req.files, req),
            companyProfile: buildDocumentUrl("companyProfile", req.files, req),
            isoCertification: buildDocumentUrl("isoCertification", req.files, req),
            authorizationCertificate: buildDocumentUrl("authorizationCertificate", req.files, req),
            complianceDeclaration: buildDocumentUrl("complianceDeclaration", req.files, req),
            productCatalog: buildDocumentUrl("productCatalog", req.files, req),
        };

        // Build vendor details and save to the Vendor model
        const vendorDetails = {
            userId: newUser._id,
            vendorId: `VENDOR-${Date.now()}`,
            email: newUser.email,
            businessName,
            fullName,
            businessAddress,
            contactNumber,
            taxId,
            documents,
            agreeToTerms: agreeToTerms === "true",
            acceptNDA: acceptNDA === "true",
        };

        const newVendor = new VendorModel(vendorDetails);
        await newVendor.save();

        const accessToken = TokenService.generateAccessToken({ userId: newUser._id });
        const refreshToken = TokenService.generateRefreshToken({ userId: newUser._id });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            status: "success",
            message: "Vendor registered successfully",
            accessToken,
        });
    } catch (error) {
        console.error("Vendor Registration Error:", error);
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// Forgot password (OTP)
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User with this email does not exist." });
        }

        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        await updateUserById(user._id, { resetPasswordOtp: otp, resetPasswordOtpExpires: otpExpires });
        await sendOtpEmail(email, otp);

        return res.json({ status: "success", message: "OTP sent to your email." });
    } catch (error) {
        handleError(error, next, "Error during OTP generation for password reset");
    }
};

// Login user
export const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid credentials." });
        }

        if (user.role === "vendor" && user.status === "Pending") {
            return res.status(403).json({ status: "error", message: "Your account is pending admin approval." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", message: "Invalid credentials." });
        }

        // Generate a temporary 6-digit 2FA code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Save code with expiry (5 minutes)
        pending2FA.set(user.username, {
            code,
            expires: Date.now() + 5 * 60 * 1000,
        });

        await send2FACode(user.email, code);

        return res.status(202).json({
            status: "2fa_required",
            message: "A 2FA code has been sent to your email.",
            username: user.username,
        });
    } catch (error) {
        return handleError(error, next, "Login error");
    }
};

// 2FA VERIFICATION FOR LOGIN
export const verify2FA = async (req, res, next) => {
    const { username, code } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid username." });
        }

        const record = pending2FA.get(username);

        if (!record) {
            return res.status(401).json({ status: "error", message: "No 2FA request found. Please login again." });
        }

        if (record.code !== code) {
            return res.status(401).json({ status: "error", message: "Invalid 2FA code." });
        }

        if (Date.now() > record.expires) {
            pending2FA.delete(username);
            return res.status(401).json({ status: "error", message: "2FA code has expired." });
        }

        pending2FA.delete(username);

        const accessToken = TokenService.generateAccessToken(user);
        const refreshToken = TokenService.generateRefreshToken(user);

        //  secure HTTP-only cookies
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 3600 * 1000),
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(Date.now() + 3600 * 1000),
        });

        logger.info(`2FA verified for user: ${user._id}`);

        return res.status(200).json({
            status: "success",
            message: "Login successful.",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        return handleError(error, next, "2FA verification error");
    }
};

// Change Password
export const changePassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User with this email does not exist." });
        }

        if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpires) {
            return res.status(400).json({ status: "error", message: "Invalid OTP or OTP expired." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ status: "error", message: "New password must be at least 6 characters long." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;

        await user.save();

        return res.status(200).json({ status: "success", message: "Password updated successfully." });
    } catch (error) {
        handleError(error, next, "Error changing password");
    }
};

export const refreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ status: "error", message: "Refresh token not found." });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ status: "error", message: "Invalid refresh token." });
        }

        // Generate new access token
        const accessToken = TokenService.generateAccessToken({ userId: user.userId });

        // Send new access token in a secure, HTTP-only cookie
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600 * 1000,
        });

        // Send back both accessToken and refreshToken
        return res.status(200).json({
            status: "success",
            message: "Access token refreshed.",
            accessToken,
            refreshToken,
        });
    });
};

//get users
export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json({
            status: "success",
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

export const logoutUser = (req, res) => {
    // Clear the tokens from cookies
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    return res.json({ status: "success", message: "Successfully logged out." });
};

const updateUserStatus = async (req, res, status, successMessage, errorMessage) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            console.warn(`${status} request missing userId`);
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        if (user.status === status) {
            return res.status(400).json({ status: "error", message: errorMessage });
        }

        user.status = status;
        await user.save();

        return res.json({ status: "success", message: successMessage, user });
    } catch (error) {
        console.error(`Error updating user status to ${status}:`, error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

// Approve User
export const approveUser = (req, res) => updateUserStatus(req, res, "Approved", "User approved successfully", "User is already approved");

// Cancel Approval (Revert back to Pending)
export const cancelApproval = (req, res) => updateUserStatus(req, res, "Pending", "Approval canceled successfully", "User is already pending");

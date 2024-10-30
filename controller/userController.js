import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { TokenService } from "../utils/tokenService.js";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

// Handle errors
const handleError = (error, next, message) => {
    logger.error(message, { error: error.message, stack: error.stack });
    return next({ status: "error", message });
};

export const registerUser = async (req, res, next) => {
    const { email, username, password } = req.body;
    logger.info("Registration attempt:", { email, username });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn("Validation errors:", { errors: errors.array() });
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

    try {
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: existingUser.email === email ? "Email already in use" : "Username already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({ email, username, password: hashedPassword, role: "admin" }); // Set role to admin
        await newUser.save();
        logger.info("User created successfully:", newUser._id);

        const accessToken = TokenService.generateAccessToken({ userId: newUser._id });
        const refreshToken = TokenService.generateRefreshToken({ userId: newUser._id });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(201).json({ status: "success", message: "User created successfully", accessToken, refreshToken });
    } catch (error) {
        handleError(error, next, "Error during user registration");
    }
};

// Forgot Password (OTP Generation)
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            logger.warn("Forgot password attempt for non-existent email:", { email });
            return res.status(404).json({ status: "error", message: "User with this email does not exist." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpires;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset OTP",
            html: `<p>You requested a password reset</p><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        logger.info("OTP sent to user:", { email });
        return res.json({ status: "success", message: "OTP sent to your email." });
    } catch (error) {
        handleError(error, next, "Error during OTP generation for password reset");
    }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User with this email does not exist." });
        }
        if (user.resetPasswordOtp !== otp || Date.now() > user.resetPasswordOtpExpires) {
            return res.status(400).json({ status: "error", message: "Invalid OTP or OTP expired." });
        }

        return res.status(200).json({ status: "success", message: "OTP verified successfully", email: user.email });
    } catch (error) {
        handleError(error, next, "Error during OTP verification");
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
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpires = null;
        await user.save();

        logger.info("Password changed successfully for user:", user._id);
        return res.status(200).json({ status: "success", message: "Password changed successfully." });
    } catch (error) {
        handleError(error, next, "Error during password change");
    }
};

// login user
export const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn("Validation errors:", { errors: errors.array() });
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            logger.warn("User not found:", { username });
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn("Invalid password attempt for user:", { username });
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const accessToken = TokenService.generateAccessToken({ userId: user._id });
        const refreshToken = TokenService.generateRefreshToken({ userId: user._id });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        logger.info("User logged in successfully:", user._id);
        return res.json({ status: "success", message: "Login successful", accessToken, refreshToken });
    } catch (error) {
        handleError(error, next, "Login error");
    }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find(); // Fetch all users from the database
        res.json({ status: "success", users });
    } catch (error) {
        logger.error("Failed to fetch users:", { message: error.message, stack: error.stack });
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Refresh Token
export const refreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ status: "error", message: "Refresh token not found." });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: "error", message: "Invalid refresh token." });

        const accessToken = TokenService.generateAccessToken({ userId: user.userId });
        return res.json({ status: "success", accessToken });
    });
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

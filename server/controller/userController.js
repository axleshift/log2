import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { TokenService } from "../utils/tokenService.js";
import { validationResult } from "express-validator";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

// Handle errors
const handleError = (error, next, message) => {
    logger.error(message, { error: error.message, stack: error.stack });
    return next(new Error(message));
};

// Register a new user with validation
export const registerUser = async (req, res, next) => {
    const { email, username, password } = req.body;
    logger.info("Registration attempt:", { email, username });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

    try {
        const existingUserEmail = await UserModel.findOne({ email });
        const existingUserUsername = await UserModel.findOne({ username });

        if (existingUserEmail) {
            return res.status(400).json({ status: "error", message: "Email already in use" });
        }
        if (existingUserUsername) {
            return res.status(400).json({ status: "error", message: "Username already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({ email, username, password: hashedPassword, role: "user" });
        await newUser.save();

        logger.info("User created successfully:", newUser._id);
        return res.status(201).json({ status: "success", message: "User created successfully" });
    } catch (error) {
        handleError(error, next, "Error during user registration");
    }
};

// Login User
export const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            logger.warn("User not found:", { username });
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn("Invalid password attempt for user:", { username });
            return res.status(401).json({ message: "Invalid credentials" });
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
        return res.json({ message: "Login successful", accessToken, refreshToken });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Refresh Token
export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
        if (err) {
            logger.error("Refresh token verification failed", { error: err.message });
            return res.sendStatus(403);
        }

        const accessToken = TokenService.generateAccessToken({ userId: user.userId });
        return res.json({ accessToken });
    });
};

// Logout a user
export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    logger.info("User logged out");
    return res.json({ status: "success", message: "Logged out successfully" });
};

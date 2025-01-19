import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { TokenService } from "../utils/tokenService.js";
import logger from "../utils/logger.js";
import { generateOtp, sendOtpEmail, storeOtp, getOtp, clearOtp } from "../utils/otpStore.js";
import { getAllUsers, findUserByEmail, findUserByUsername, createUser } from "./userController.js";

const handleError = (error, next, message) => {
    logger.error(message, { error: error.message, stack: error.stack });
    return next({ status: "error", message });
};

export const sendOTPForRegistration = async (req, res, next) => {
    const { email } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email already in use" });
        }

        // Generate OTP and store it
        const otp = generateOtp();
        storeOtp(email, otp);

        // Send OTP to the user's email
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
        // Retrieve the OTP from the store
        const storedOtp = getOtp(email);

        if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expires) {
            return res.status(400).json({ status: "error", message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful validation
        clearOtp(email);

        return res.status(200).json({ status: "success", message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

export const registerUser = async (req, res, next) => {
    const { email, username, password, role } = req.body;

    const validRoles = ["user", "supplier", "admin", "super admin", "auditor", "staff", "inventory manager", "procurement manager", "regional manager", "vendor", "buyer", "finance", "temporary staff", "delivery partner", "customer support"];

    const userRole = validRoles.includes(role) ? role : "user";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

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
            role: userRole,
            status: "Active", // Default status
        });

        const accessToken = TokenService.generateAccessToken({ userId: newUser._id });
        const refreshToken = TokenService.generateRefreshToken({ userId: newUser._id });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 DAYS
        });

        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            accessToken,
            refreshToken,
        });
    } catch (error) {
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
        logger.warn("Validation errors:", { errors: errors.array() });
        return res.status(400).json({ status: "error", errors: errors.array() });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        // Check if user status is active
        if (user.status !== "Active") {
            return res.status(403).json({ status: "error", message: "User account is inactive or banned." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
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

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        handleError(error, next, "Login error");
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
    if (!refreshToken) return res.status(401).json({ status: "error", message: "Refresh token not found." });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: "error", message: "Invalid refresh token." });

        // Generate new access token
        const accessToken = TokenService.generateAccessToken({ userId: user.userId });
        return res.json({ status: "success", accessToken });
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

import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { TokenService } from "../utils/tokenService.js";
import logger from "../utils/logger.js";
import { generateOtp, sendOtpEmail, storeOtp, getOtp, clearOtp } from "../utils/otpStore.js";
import { getAllUsers, findUserByEmail, findUserByUsername, createUser } from "./userController.js";
import VendorModel from "../models/vendor.js";
import UserModel from "../models/UserModel.js";

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
    const { email, username, password, role, vendorDetails } = req.body;

    const validRoles = ["user", "admin", "super admin", "vendor", "buyer", "finance"];
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
            status: userRole === "vendor" ? "Pending" : "Active",
        });

        if (!newUser) {
            throw new Error("User creation failed");
        }

        // Handle vendor creation if user role is 'vendor'
        if (userRole === "vendor" && vendorDetails) {
            const vendorData = {
                userId: newUser._id,
                businessName: vendorDetails.businessName,
                fullName: vendorDetails.fullName,
                businessAddress: vendorDetails.businessAddress,
                contactNumber: vendorDetails.contactNumber,
                certifications: vendorDetails.certifications || [],
                taxId: vendorDetails.taxId || `TAX-${Date.now()}`,
                vendorId: `VENDOR-${Date.now()}`,
            };

            console.log("Vendor Data:", vendorData);

            try {
                const newVendor = new VendorModel(vendorData);
                await newVendor.save();
            } catch (error) {
                console.error("Error creating vendor:", error);
                return res.status(500).json({ status: "error", message: "Vendor creation failed." });
            }
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

        // Prevent vendors from logging in if not approved
        if (user.role === "vendor" && user.status === "Pending") {
            return res.status(403).json({ status: "error", message: "Your account is pending approval by an admin." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const accessToken = TokenService.generateAccessToken(user);
        const refreshToken = TokenService.generateRefreshToken(user);

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

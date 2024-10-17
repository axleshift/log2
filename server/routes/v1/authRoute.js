import express from "express";
import UserModel from "../../models/UserModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { registerValidation, loginValidation } from "../../middleware/validationHandler.js";
import { TokenService } from "../../utils/tokenService.js";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ status: "error", message: err.message || "Internal server error" });
};

// Registration Route
router.post("/register", registerValidation, async (req, res, next) => {
    const { email, username, password } = req.body;
    console.log("Registration attempt:", { email, username });

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            console.log("Registration failed: Email already in use");
            return res.status(400).json({ status: "error", message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({ email, username, password: hashedPassword });
        await newUser.save();

        console.log("User created successfully:", newUser._id); // Log user ID instead of the whole object
        return res.status(201).json({ status: "success", message: "User created successfully" });
    } catch (error) {
        next(error); // Pass to error handler
    }
});


// Login Route
router.post("/login", loginValidation, async (req, res, next) => {
    const { username, password } = req.body;
    console.log("Login attempt for user:", username);

    if (!username || !password) {
        console.log("Login failed: Username and password are required");
        return res.status(400).json({ status: "error", message: "Username and password are required" });
    }

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            console.log("Login failed: Invalid credentials");
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Login failed: Invalid credentials");
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const accessToken = TokenService.generateAccessToken({ userId: user._id, role: user.role });
        console.log("Login successful for user:", user.username);

        res.json({
            status: "success",
            message: "Login successful",
            token: accessToken,
        });
    } catch (error) {
        next(error); // Pass to error handler
    }
});

// Logout Route
router.post("/logout", (req, res) => {
    console.log("User logged out");
    return res.json({ status: "success", message: "Logged out successfully" });
});

// Use the error handler middleware
router.use(errorHandler);

export default router;

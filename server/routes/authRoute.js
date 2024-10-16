import express from "express";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { registerValidation, loginValidation } from "../middleware/validationHandler.js";
import { TokenService } from "../utils/tokenService.js";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Registration Route
router.post("/register", registerValidation, async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({ email, username, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ status: "success", message: "User created successfully" });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// Login Route
router.post("/login", loginValidation, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: "error", message: "Username and password are required" });
    }

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const accessToken = TokenService.generateAccessToken({ userId: user._id, role: user.role });

        // Send the access token in the response body
        res.json({
            status: "success",
            message: "Login successful",
            token: accessToken // Return the token here
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

// Logout Route
router.post("/logout", (req, res) => {
    return res.json({ status: "success", message: "Logged out successfully" });
});

export default router;

import express from "express";
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { registerValidation, loginValidation } from "../middleware/validationHandler.js";
import { tokenMiddleware } from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Validate environment variables
const validateEnvVariables = () => {
    if (!SECRET_KEY || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Environment variables not set properly.");
    }
};

validateEnvVariables();

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

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true }); // Set the token as a cookie
        res.json({ status: "success", message: "Login successful" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

// Profile Route
router.get("/profile", tokenMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId); // Use req.userId set by tokenMiddleware
        if (!user) {
            return res.sendStatus(404); // Not Found
        }

        res.json({ user: { id: user._id, email: user.email, username: user.username } });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

export default router;

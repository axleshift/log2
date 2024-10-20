import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken } from "../../controller/userController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Logout a user
router.post("/logout", logoutUser);

router.post("/refresh", refreshToken);

export default router;

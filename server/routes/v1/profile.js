import express from "express";
import { createProfile, getProfileByUserId, updateProfile, deleteProfile } from "../../controller/profileController.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Create a new profile
router.post("/", tokenMiddleware, createProfile);
// Get a profile by user ID
router.get("/:userId", tokenMiddleware, getProfileByUserId);
// Update a profile by user ID
router.put("/:userId", tokenMiddleware, updateProfile);
// Delete a profile by user ID
router.delete("/:userId", tokenMiddleware, deleteProfile);

export default router;

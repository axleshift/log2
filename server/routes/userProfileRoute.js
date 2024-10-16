import express from 'express';
import { tokenMiddleware } from '../middleware/authMiddleware.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// Get current user's profile
router.get('/users', tokenMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select('username email role');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Update current user's profile
router.put('/users', tokenMiddleware, async (req, res) => {
    const { username, email, role } = req.body;

    if (!username && !email) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.userId,
            { username, email, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user data' });
    }
});

export default router;

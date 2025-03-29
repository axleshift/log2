import Notification from "../models/notification.js";

// 🔔 Create a notification linked to the authenticated user
export const createNotification = async (req, res) => {
    try {
        const { message, type = "info", userId } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ error: "Message and user are required" });
        }

        const notification = new Notification({
            user: userId,
            message,
            type,
        });

        await notification.save();
        return res.status(201).json(notification);
    } catch (error) {
        console.error("Create Notification Error:", error);
        return res.status(500).json({ error: "Failed to create notification" });
    }
};

// 📥 Get all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// ✅ Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

        if (!updated) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.status(200).json(updated);
    } catch (error) {
        console.error("Mark as Read Error:", error);
        return res.status(500).json({ error: "Failed to update notification" });
    }
};

// ❌ Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Notification.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({ error: "Failed to delete notification" });
    }
};

import Announcement from "../models/announcement.js";

// Create
export const createAnnouncement = async (req, res) => {
    try {
        const { message, date } = req.body;

        if (!message || !date) {
            return res.status(400).json({ error: "Message and date are required" });
        }

        const newAnnouncement = new Announcement({
            message,
            date: new Date(date),
        });

        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error("Create announcement error:", error);
        res.status(500).json({ error: "Failed to create announcement" });
    }
};

// Get all
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: 1 }); // sort by upcoming
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
};

// Get by ID
export const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found" });
        }
        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch announcement" });
    }
};

// Update
export const updateAnnouncement = async (req, res) => {
    try {
        const { message, date } = req.body;

        const updated = await Announcement.findByIdAndUpdate(req.params.id, { message, date: new Date(date) }, { new: true });

        if (!updated) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update announcement" });
    }
};

// Delete
export const deleteAnnouncement = async (req, res) => {
    try {
        const deleted = await Announcement.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete announcement" });
    }
};

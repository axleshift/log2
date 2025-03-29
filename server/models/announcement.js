import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    message: { type: String, required: true },
    date: { type: Date, required: true }, // 🗓️ Event date
    createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("announcement", announcementSchema);
export default Announcement;

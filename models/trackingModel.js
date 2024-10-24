import mongoose from "mongoose";

// models/Tracking.js

const trackingSchema = new mongoose.Schema({
    trackingNumber: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientPhone: { type: String, required: true },
    orderHistory: [
        {
            date: { type: String, required: true },
            status: { type: String, required: true },
            location: { type: String, required: true },
            delivered: { type: Boolean, required: true },
        },
    ],
});

const TrackingItem = mongoose.model("Tracking", trackingSchema);

export default TrackingItem;

import mongoose from "mongoose";

const logisticsSchema = new mongoose.Schema(
    {
        incomingShipment: {
            tracking_id: { type: String, required: true, unique: true },
            current_location: { type: String, required: true },
            date_time_release: { type: Date, required: true },
            estimated_arrival: { type: Date, required: true },
            courier: { type: String, required: true },
        },
        outgoingShipment: {
            tracking_id: { type: String, required: true, unique: true },
            next_destination: { type: String, required: true },
            estimated_time: { type: String, required: true },
            courier: { type: String, required: true },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Logistics", logisticsSchema);

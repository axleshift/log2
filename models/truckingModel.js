import mongoose from "mongoose";

const truckingItemSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        billingAddress: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        recipientAddress: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        paidAmount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "Pending", // Default status
        },
    },
    { timestamps: true }
);

const TruckingItem = mongoose.model("TruckingItem", truckingItemSchema);

export default TruckingItem;

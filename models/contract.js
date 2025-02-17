import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    contractNumber: {
        type: String,
        required: true,
        unique: true,
    },
    contractDetails: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    renewalDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "expired", "pending"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;

import mongoose from "mongoose";

const vendorQuotePendingSchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        price: { type: Number, required: true },
        details: { type: String },
        leadTime: { type: String },
        terms: { type: String },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
        rfqId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RFQ",
            required: true,
        },
    },
    { timestamps: true }
);

const VendorQuotePending = mongoose.model("VendorQuotePending", vendorQuotePendingSchema);

export default VendorQuotePending;

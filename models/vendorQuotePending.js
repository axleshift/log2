import mongoose from "mongoose";

const vendorQuotePendingSchema = new mongoose.Schema(
    {
        vendorName: { type: String, required: true },
        price: { type: Number, required: true },
        details: { type: String },
        status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    },
    { timestamps: true }
);

const VendorQuotePending = mongoose.model("VendorQuotePending", vendorQuotePendingSchema);

export default VendorQuotePending;

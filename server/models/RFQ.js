import mongoose from "mongoose";

const RFQSchema = new mongoose.Schema(
    {
        procurementId: { type: mongoose.Schema.Types.ObjectId, ref: "Procurement", required: true },
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
        products: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: { type: String, required: true },
                unitPrice: { type: Number },
            },
        ],
        deadline: { type: Date, required: true },
        status: {
            type: String,
            enum: ["Open", "Closed", "Awarded", "Cancelled"],
            default: "Open",
        },
        quotes: [
            {
                vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
                totalPrice: { type: Number, required: true },
                quoteDate: { type: Date, default: Date.now },
                terms: { type: String },
                status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
            },
        ],
        selectedVendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    },
    { timestamps: true }
);
const RFQ = mongoose.models.RFQ || mongoose.model("RFQ", RFQSchema);

export default RFQ;

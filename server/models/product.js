import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        tracking_id: { type: String, required: true, unique: true },
        itemName: { type: String, required: true },
        description: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        category: { type: String, required: true },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
        stockQuantity: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Available", "Out of Stock"],
            default: "Available",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);

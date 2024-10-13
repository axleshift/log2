import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        min_level: {
            type: Number,
            required: true,
            min: 0,
        },
        location: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    }
);

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItem;

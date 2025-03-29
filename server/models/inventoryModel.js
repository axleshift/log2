import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
        warehouse_id: { type: String },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        sku: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        stock_level: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["In Stock", "Out of Stock", "Pending"],
            default: "In Stock",
        },
    },
    { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;

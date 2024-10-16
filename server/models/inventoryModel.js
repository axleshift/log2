import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
    },
    vendorName: {
        type: String,
        required: true,
    },
    unitsReceived: {
        type: Number,
        required: true,
    },
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItem;

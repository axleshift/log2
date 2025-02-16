import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor", // Assumes you have a Vendor model
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // Assumes you have a Product model
                required: true,
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "shipped", "completed"],
        default: "pending",
    },
    invoice: {
        type: String, // Stores the file path for the attached invoice
    },
    additionalDocuments: [
        {
            type: String, // Stores file paths for additional attached documents
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;

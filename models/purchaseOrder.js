import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema(
    {
        poNumber: { type: String, required: true, unique: true },
        orderDate: { type: Date, required: true },
        receiveDate: { type: Date },
        carrier: { type: String },
        vendor: {
            businessName: { type: String, required: true },
            businessAddress: { type: String, required: true },
            contactNumber: { type: String, required: true },
        },
        shipTo: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true },
        details: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                description: { type: String, required: true },
                quantity: { type: Number, required: true },
                unitPrice: { type: Number, required: true },
                subTotal: { type: Number, required: true },
            },
        ],
        procurementId: { type: mongoose.Schema.Types.ObjectId, ref: "Procurement" },
        rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", default: null },
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
        additionalNotes: { type: String },
        warehouse_id: { type: String },
        received: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;

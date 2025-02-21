import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema({
    procurementId: { type: mongoose.Schema.Types.ObjectId, ref: "Procurement" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            unitPrice: Number,
            totalPrice: {
                type: Number,
                default: function () {
                    return this.quantity * this.unitPrice;
                },
            },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Delivered"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid", "Partially Paid"], default: "Unpaid" },
    createdAt: { type: Date, default: Date.now },
});

const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;

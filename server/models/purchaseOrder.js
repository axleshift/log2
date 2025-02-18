import mongoose from "mongoose";
const { Schema } = mongoose;

const PurchaseOrderSchema = new Schema({
    procurement: { type: Schema.Types.ObjectId, ref: "Procurement" },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    orderNumber: { type: String, required: true, unique: true },

    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            totalPrice: {
                type: Number,
                required: true,
                default: function () {
                    return this.quantity * this.price;
                },
            },
        },
    ],
    shipments: [{ type: Schema.Types.ObjectId, ref: "Shipment" }],
    status: {
        type: String,
        enum: ["Ordered", "Shipped", "Delivered", "Cancelled"],
        default: "Ordered",
    },

    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Partially Paid"], default: "Pending" },

    payments: [
        {
            vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
            amount: { type: Number, required: true },
            method: {
                type: String,
                enum: ["Bank Transfer", "Credit Card", "PayPal", "Cash", "Cheque"],
                required: true,
            },
            status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
            transactionId: { type: String },
            paymentDate: { type: Date },
        },
    ],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
export default PurchaseOrder;

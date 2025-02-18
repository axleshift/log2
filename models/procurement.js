import mongoose from "mongoose";
const { Schema } = mongoose;

const ProcurementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    procurementDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },

    status: {
        type: String,
        enum: ["Draft", "RFQ Issued", "Evaluating Quotes", "Negotiation", "Purchase Order Created", "Shipped", "Completed", "Cancelled"],
        default: "Draft",
    },

    invitedVendors: [{ type: Schema.Types.ObjectId, ref: "Vendor" }],
    quotes: [
        {
            vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
            price: { type: Number, required: true },
            terms: { type: String },
            deliveryTime: { type: String },
            status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
        },
    ],

    negotiations: [
        {
            vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
            proposedTerms: { type: String },
            finalTerms: { type: String },
            status: { type: String, enum: ["Ongoing", "Finalized"], default: "Ongoing" },
        },
    ],

    // Allow multiple POs per Procurement
    purchaseOrders: [{ type: Schema.Types.ObjectId, ref: "PurchaseOrder" }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Procurement = mongoose.model("Procurement", ProcurementSchema);
export default Procurement;

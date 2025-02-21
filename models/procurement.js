import mongoose from "mongoose";

const ProcurementSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    procurementDate: Date,
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Completed"], default: "Pending" },
    rfqRequired: Boolean,
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ" },
    purchaseOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" }],
});

const Procurement = mongoose.models.Procurement || mongoose.model("Procurement", ProcurementSchema);

export default Procurement;

import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    purchaseOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
    amountDue: Number,
    amountPaid: Number,
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;

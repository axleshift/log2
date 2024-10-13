import mongoose from "mongoose";

const InvoiceSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        receiptAdd: {
            type: String,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;

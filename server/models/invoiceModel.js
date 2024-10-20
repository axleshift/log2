import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
});

// Calculate total for each item before saving
itemSchema.pre("save", function (next) {
    this.total = this.quantity * this.unitPrice;
    next();
});

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, required: true, unique: true },
        invoiceDate: { type: Date, default: Date.now },
        customer: {
            name: { type: String, required: true },
            address: {
                street: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
            contact: {
                phone: { type: String },
                email: { type: String },
            },
        },
        items: [itemSchema],
        summary: {
            subtotal: { type: Number, required: true },
            shippingCharges: { type: Number, required: true },
            taxes: { type: Number, required: true },
            totalAmountDue: { type: Number, required: true },
        },
        paymentTerms: {
            methods: { type: String, required: true },
            dueDate: { type: Date, required: true },
        },
        notes: { type: String },
    },
    { timestamps: true }
);

// Calculate summary before saving invoice
invoiceSchema.pre("save", function (next) {
    this.summary.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.summary.totalAmountDue = this.summary.subtotal + this.summary.shippingCharges + this.summary.taxes;
    next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;

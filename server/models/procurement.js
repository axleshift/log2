import mongoose from "mongoose";

const ProcurementSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        procurementDate: { type: Date, required: true },
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        department: {
            type: String,
            enum: ["HR", "Finance", "Logistics", "IT", "Procurement", "Operations"],
            required: true,
        },
        products: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: { type: String, required: true },
                unitPrice: { type: Number, required: true },
            },
        ],
        estimatedCost: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Completed"],
            default: "Pending",
        },
        rejectionReason: { type: String, default: null }, // Add this field
        deliveryDate: { type: Date, default: null },
    },
    { timestamps: true }
);

ProcurementSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.products && Array.isArray(update.products)) {
        update.estimatedCost = update.products.reduce((total, product) => {
            const unitPrice = product.unitPrice || 0;
            const quantity = product.quantity || 0;
            return total + quantity * unitPrice;
        }, 0);
    }
    next();
});

const Procurement = mongoose.models.Procurement || mongoose.model("Procurement", ProcurementSchema);

export default Procurement;

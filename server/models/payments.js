import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        paymentId: { type: String, required: true, unique: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
        amount: { type: Number, required: true },
        status: { type: String, required: true, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);

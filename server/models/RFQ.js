import mongoose from "mongoose";

const RFQSchema = new mongoose.Schema(
    {
        rfqNumber: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: { type: String, required: true },
            },
        ],
        vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
        quotes: [
            {
                vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
                price: { type: Number, required: true },
                deliveryTime: { type: String, required: true },
                additionalNotes: { type: String },
            },
        ],
        awardedVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
        status: {
            type: String,
            enum: ["Open", "Closed", "Awarded"],
            default: "Open",
        },
        budget: { type: Number, required: true },
        deadline: { type: Date, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const RFQ = mongoose.model("RFQ", RFQSchema);
export default RFQ;

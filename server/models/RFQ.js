import mongoose from "mongoose";

const RFQSchema = new mongoose.Schema({
    procurementId: { type: mongoose.Schema.Types.ObjectId, ref: "Procurement" },
    status: { type: String, enum: ["Open", "Closed", "Awarded"], default: "Open" },
    products: [
        {
            name: String,
            quantity: Number,
            specs: String,
        },
    ],
    invitedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
    quotes: [
        {
            vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
            quoteAmount: Number,
            deliveryTime: Number,
            status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
            items: [
                {
                    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                    quantity: Number,
                    unitPrice: Number,
                },
            ],
        },
    ],
    awardedVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
    paymentTerms: {
        type: String,
        enum: ["Due on Receipt", "Net 30", "Net 60", "Installments"],
        default: "Net 30",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Added createdBy field
    createdAt: { type: Date, default: Date.now },
});

const RFQ = mongoose.model("RFQ", RFQSchema);

export default RFQ;

import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorName: String,
    price: { type: Number, required: true },
    deliveryTime: { type: String, required: true },
    additionalTerms: String,
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    submittedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

BidSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Bid = mongoose.model("Bid", BidSchema);

export default Bid;

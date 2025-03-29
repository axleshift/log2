import mongoose from "mongoose";

const AwardNoticeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, required: true, default: Date.now },
        details: { type: String },

        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },

        poId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PurchaseOrder",
        },
    },
    { timestamps: true }
);

const AwardNotice = mongoose.model("AwardNotice", AwardNoticeSchema);
export default AwardNotice;

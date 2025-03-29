import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: { type: String, required: true },
    fullName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    certifications: [{ type: String }],
    taxId: { type: String },
  },
  { timestamps: true }
);

vendorSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "vendorId",
});

const VendorModel = mongoose.model("Vendor", vendorSchema);
export default VendorModel;

import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vendorId: { type: String, required: true, unique: true },
        businessName: { type: String, required: true },
        fullName: { type: String, required: true },
        businessAddress: { type: String, required: true },
        contactNumber: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String },
        businessRegistrationNumber: { type: String },
        businessType: { type: String },
        countryOfRegistration: { type: String },
        yearEstablished: { type: Number },
        taxId: { type: String },
        documents: {
            businessRegistrationCertificate: { type: String },
            companyProfile: { type: String },
            isoCertification: { type: String },
            authorizationCertificate: { type: String },
            complianceDeclaration: { type: String },
            productCatalog: { type: String },
        },
        agreeToTerms: { type: Boolean, default: false },
        acceptNDA: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Virtual: bids
vendorSchema.virtual("bids", {
    ref: "Bid",
    localField: "_id",
    foreignField: "vendorId",
});

const VendorModel = mongoose.model("Vendor", vendorSchema);
export default VendorModel;

/**
 * 
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

**/

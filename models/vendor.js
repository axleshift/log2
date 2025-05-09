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
        email: { type: String, required: true },
        website: { type: String },

        // Extended Fields
        businessRegistrationNumber: { type: String },
        businessType: { type: String },
        countryOfRegistration: { type: String },
        yearEstablished: { type: Number },
        taxId: { type: String },
        vatNumber: { type: String },

        // Document uploads (store file URLs or paths)
        documents: {
            businessRegistrationCertificate: { type: String },
            taxClearanceCertificate: { type: String },
            financialStatements: { type: String },
            insuranceCertificate: { type: String },
            companyProfile: { type: String },
            isoCertification: { type: String },
            authorizationCertificate: { type: String },
            complianceDeclaration: { type: String },
            productCatalog: { type: String },
        },

        // Product/service information
        categories: [{ type: String }],
        authorizedDealer: { type: Boolean, default: false },

        certifications: [{ type: String }],

        // Banking information
        bankingInfo: {
            bankName: { type: String },
            bankAccountNumber: { type: String },
            bankSwiftCode: { type: String },
            bankCountry: { type: String },
        },

        // Terms acceptance
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

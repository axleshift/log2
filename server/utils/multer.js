import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "product",
        format: file.mimetype.split("/")[1],
        public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    }),
});

const upload = multer({ storage });

const documentStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isPDF = file.mimetype === "application/pdf";

        return {
            folder: "vendor_documents",
            format: "pdf",
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
            resource_type: isPDF ? "image" : "raw",
        };
    },
});

const uploadVendorDocuments = multer({ storage: documentStorage }).fields([
    { name: "businessRegistrationCertificate", maxCount: 1 },
    { name: "companyProfile", maxCount: 1 },
    { name: "isoCertification", maxCount: 1 },
    { name: "authorizationCertificate", maxCount: 1 },
    { name: "complianceDeclaration", maxCount: 1 },
    { name: "productCatalog", maxCount: 1 },
]);

export { upload, uploadVendorDocuments };

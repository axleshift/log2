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

export default upload;

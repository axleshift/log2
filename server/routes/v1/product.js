import express from "express";
import { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from "../../controller/product.js";
import upload from "../../utils/multer.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", tokenMiddleware, upload.array("images", 5), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);

export default router;

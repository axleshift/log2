import Product from "../models/product.js";

// Create Product
export const createProduct = async (req, res) => {
    try {
        const { itemName, description, price, category, stockQuantity, status, sku, weight, dimensions, manufacturer, tags, color, size } = req.body;

        const imageUrls = req.files?.map((file) => file.path) || [];

        const product = new Product({
            itemName,
            description,
            price,
            category,
            stockQuantity,
            status,
            sku,
            images: imageUrls,
            weight,
            dimensions,
            manufacturer,
            tags,
            created_by: req.user.id,
            color,
            size,
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("created_by", "fullName");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("created_by", "fullName");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Product by ID
export const updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("created_by", "fullName");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Product by ID
export const deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

import Product from "../models/product.js";

// Create Product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stockQuantity, status, sku, weight, dimensions, manufacturer, tags, color, size } = req.body;

        // Process images from file uploads
        const imageUrls = req.files ? req.files.map((file) => file.path) : [];

        // Parse dimensions (allow object or JSON string)
        let parsedDimensions = { length: 0, width: 0, height: 0 };
        if (dimensions) {
            if (typeof dimensions === "string") {
                try {
                    const dim = JSON.parse(dimensions);
                    parsedDimensions = {
                        length: parseFloat(dim.length) || 0,
                        width: parseFloat(dim.width) || 0,
                        height: parseFloat(dim.height) || 0,
                    };
                } catch (err) {
                    console.error("❌ Invalid dimensions format:", dimensions);
                    return res.status(400).json({ message: "Invalid dimensions format" });
                }
            } else if (typeof dimensions === "object") {
                parsedDimensions = {
                    length: parseFloat(dimensions.length) || 0,
                    width: parseFloat(dimensions.width) || 0,
                    height: parseFloat(dimensions.height) || 0,
                };
            }
        }

        // Parse tags: allow comma-separated string or an array
        let parsedTags = [];
        if (tags) {
            if (typeof tags === "string") {
                parsedTags = tags.split(",").map((tag) => tag.trim());
            } else if (Array.isArray(tags)) {
                parsedTags = tags;
            }
        }

        // Create a new product document with proper numeric parsing
        const newProduct = new Product({
            name,
            description,
            price: price ? parseFloat(price) : 0,
            category,
            stockQuantity: stockQuantity ? parseInt(stockQuantity, 10) : 0,
            status,
            sku,
            images: imageUrls,
            weight: weight ? parseFloat(weight) : 0,
            dimensions: parsedDimensions,
            manufacturer,
            tags: parsedTags,
            color,
            size,
        });

        await newProduct.save();

        return res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error("🔥 Internal Error:", error);
        return res.status(500).json({ status: "error", message: errorMessage });
    }
};

// Get all Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product by ID
export const updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).exec();

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Product by ID
export const deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id).exec();
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
import Product from "../models/product.js";

// Create Product
export const createProduct = async (req, res) => {
    try {
        const { itemName, description, price, category, stockQuantity, status, sku, weight, dimensions, manufacturer, tags, color, size } = req.body;
        console.log("🔵 Debug: req.user:", req.user);
        console.log("🟢 Debug: Received Payload", req.body);

        if (!req.user.id) {
            return res.status(400).json({ message: "User is not authenticated" });
        }

        const imageUrls = req.files?.map((file) => file.path) || [];
        const createdBy = req.user.id;

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
            createdBy,
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
        const products = await Product.find().populate("createdBy", "fullName").exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "fullName");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product by ID
export const updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("createdBy", "fullName");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
};
**/

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    stockQuantity: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["Available", "Out of Stock", "Discontinued", "Pre-order"],
      default: "Available",
    },
    sku: { type: String, unique: true, required: true },
    images: [{ type: String }],
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    manufacturer: { type: String },
    tags: [{ type: String }],
    color: { type: String },
    size: { type: String },
  },
  { timestamps: true }
);

ProductSchema.virtual("inventory", {
  ref: "Inventory",
  localField: "_id",
  foreignField: "product",
});

ProductSchema.virtual("purchaseOrders", {
  ref: "PurchaseOrder",
  localField: "_id",
  foreignField: "details.productId",
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;

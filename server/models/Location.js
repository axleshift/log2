// models/Location.js
import mongoose from "mongoose";

// Define the Location Schema
const locationSchema = new mongoose.Schema(
    {
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse", // Reference to the 'Warehouse' model (this assumes the Warehouse model is created correctly)
            required: true,
        },
        row: {
            type: String,
            required: true,
        },
        shelf: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
    }
);

// Create and export the Location model based on the schema
const Location = mongoose.model("Location", locationSchema);

export default Location;

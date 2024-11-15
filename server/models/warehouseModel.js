import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
    {
        warehouse_id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        location: {
            type: String,
            required: false,
        },
        capacity: {
            type: String,
            required: false,
        },
        goods_stored: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;

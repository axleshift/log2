import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    warehouse_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: String, required: true },
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" }],
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;

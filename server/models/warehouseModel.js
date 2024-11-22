import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    warehouse_id: { type: String, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    type_of_goods: { type: String, required: true },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;

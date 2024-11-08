import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
    {
        warehouse_id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        capacity_total: { type: Number, required: true },
        capacity_available: { type: Number, required: true },
        status: { type: String, required: true, enum: ["Full", "Available", "Under Maintenance"], default: "Available" }, // added enum for more control
        shipments_stored: { type: Number, required: true },
        types_of_goods: { type: [String], required: true },
        shipment_ids: { type: [String], required: true },
        last_shipment_received: { type: Date, required: true },
        next_expected_shipment: { type: Date, required: true },
        warehouse_manager: {
            name: { type: String, required: true },
            contact: { type: String, required: true },
        },
        number_of_staff: { type: Number, required: true },
        geolocation: {
            latitude: { type: Number, required: true, min: -90, max: 90 },
            longitude: { type: Number, required: true, min: -180, max: 180 },
        },
        dock_bays: { type: Number, required: true },
        storage_conditions: { type: [String], required: true },
        last_inspection_date: { type: Date, required: true },
        inspection_results: { type: String, required: true },
        operational_hours: { type: String, required: true },
        lease_expiry_date: { type: Date, required: true },
    },
    { timestamps: true }
);

warehouseSchema.index({ name: 1 });
warehouseSchema.index({ location: 1 });
warehouseSchema.index({ warehouse_id: 1 });

export default mongoose.model("Warehouse", warehouseSchema);

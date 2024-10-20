import mongoose from "mongoose";

// Shipper Schema
const shipperSchema = new mongoose.Schema({
    shipper_company_name: { type: String, required: true },
    shipper_contact_name: { type: String, required: true },
    shipper_contact_email_address: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    shipper_company_address: { type: String, required: true },
});

// Consignee Schema
const consigneeSchema = new mongoose.Schema({
    consignee_company_name: { type: String, required: true },
    consignee_contact_name: { type: String, required: true },
    consignee_contact_email_address: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
    },
    consignee_contact_phone_number: { type: String, required: true },
    consignee_company_address: { type: String, required: true },
});

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
    shipment_description: { type: String, required: true },
    shipment_weight: { type: Number, required: true },
    shipment_dimension_length: { type: Number, required: true },
    shipment_dimension_width: { type: Number, required: true },
    shipment_dimension_height: { type: Number, required: true },
    shipment_volume: { type: Number, required: true },
    shipment_value: { type: Number, required: true },
    shipment_instructions: { type: String, default: "" },
});

// Shipping Schema
const shippingSchema = new mongoose.Schema({
    shipping_type: { type: String, required: true }, // 'air', 'land', or 'sea'
    shipping_details: {
        air: {
            shipping_origin_airport: { type: String },
            shipping_destination_airport: { type: String },
            shipping_preferred_departure_date: { type: Date },
            shipping_preferred_arrival_date: { type: Date },
            shipping_flight_type: { type: String, default: "1" },
        },
        land: {
            shipping_origin_address: { type: String },
            shipping_destination_address: { type: String },
            shipping_pickup_date: { type: Date },
            shipping_delivery_date: { type: Date },
            shipping_vehicle_type: { type: Number, default: 0 },
        },
        sea: {
            shipping_loading_port: { type: String },
            shipping_discharge_port: { type: String },
            shipping_sailing_date: { type: Date },
            shipping_estimated_arrival_date: { type: Date },
            shipping_cargo_type: { type: Number, default: 1 },
        },
    },
});

// Complete Shipment Record Schema
const InventoryRecordSchema = new mongoose.Schema({
    shipper: shipperSchema,
    consignee: consigneeSchema,
    shipment: shipmentSchema,
    shipping: shippingSchema,
    status: { type: String, enum: ["pending", "in transit", "delivered", "canceled"], default: "pending" },
});

// indexes for faster queries
InventoryRecordSchema.index({ "shipper.shipper_company_name": 1 });
InventoryRecordSchema.index({ "consignee.consignee_company_name": 1 });

const InventoryRecord = mongoose.model("InventoryRecord", InventoryRecordSchema);

export default InventoryRecord;

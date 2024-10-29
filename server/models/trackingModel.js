import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
    {
        shipper: {
            shipper_company_name: { type: String, required: true },
            shipper_contact_name: { type: String, required: true },
            shipper_contact_email_address: { type: String, required: true },
            shipper_contact_phone_number: { type: String, required: true },
            shipper_company_address: { type: String, required: true },
        },
        consignee: {
            consignee_company_name: { type: String, required: true },
            consignee_contact_name: { type: String, required: true },
            consignee_contact_email_address: { type: String, required: true },
            consignee_contact_phone_number: { type: String, required: true },
            consignee_company_address: { type: String, required: true },
        },
        shipment: {
            shipment_description: { type: String, required: true },
            shipment_weight: { type: Number, required: true },
            shipment_dimension_length: { type: Number, required: true },
            shipment_dimension_width: { type: Number, required: true },
            shipment_dimension_height: { type: Number, required: true },
            shipment_volume: { type: Number, required: true },
            shipment_value: { type: Number, required: true },
            shipment_instructions: { type: String, required: true },
        },
        shipping: {
            shipping_type: { type: String, required: true }, // 'air', 'land', or 'sea'
            details: {
                air: {
                    origin_airport: { type: String },
                    destination_airport: { type: String },
                    preferred_departure_date: { type: Date },
                    preferred_arrival_date: { type: Date },
                    flight_type: { type: String },
                },
                land: {
                    origin_address: { type: String },
                    destination_address: { type: String },
                    pickup_date: { type: Date },
                    delivery_date: { type: Date },
                    vehicle_type: { type: Number },
                },
                sea: {
                    loading_port: { type: String },
                    discharge_port: { type: String },
                    sailing_date: { type: Date },
                    estimated_arrival_date: { type: Date },
                    cargo_type: { type: Number },
                },
            },
        },
        tracking_id: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.model("Shipment", shipmentSchema);

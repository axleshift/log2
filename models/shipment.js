import mongoose from "mongoose";
const { Schema } = mongoose;

const ShipmentSchema = new Schema(
    {
        receiveDate: { type: Date, required: true },
        isInWarehouse: { type: Boolean, required: true },
        dispatch: {
            type: String,
            enum: ["Pending", "Dispatching", "Completed"],
            default: "Pending",
            required: true,
        },
        type: {
            type: String,
            enum: ["public", "private", "business"],
            default: "public",
            required: true,
        },
        paid: {
            type: String,
            enum: ["Unpaid", "Paid", "Void"],
            default: "Unpaid",
            required: true,
        },
        amount: { type: Number },
        warehouse_id: { type: String },
        country: { type: String },
        items: { type: Number },

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
            shipment_volume: { type: Number },
            shipment_value: { type: Number, required: true },
            shipment_instructions: { type: String, required: true },
        },

        vehicle: {
            name: { type: String },
            plate_no: { type: String },
            driver_name: { type: String },
        },

        shipping: {
            shipping_type: {
                type: String,
                required: true,
                enum: ["air", "land", "sea"],
            },
            shipping_details: {
                origin_address: { type: String },
                destination_address: { type: String },
                pickup_date: { type: Date },
                delivery_date: { type: Date },
                vehicle_type: { type: String },
                origin_airport: { type: String },
                destination_airport: { type: String },
                preferred_departure_date: { type: Date },
                preferred_arrival_date: { type: Date },
                flight_type: { type: String },
                loading_port: { type: String },
                discharge_port: { type: String },
                sailing_date: { type: Date },
                estimated_arrival_date: { type: Date },
                cargo_type: { type: String },
            },
        },

        tracking_id: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

// Auto-calculate shipment volume before save
ShipmentSchema.pre("save", function (next) {
    if (this.shipment.shipment_dimension_length && this.shipment.shipment_dimension_width && this.shipment.shipment_dimension_height) {
        this.shipment.shipment_volume = this.shipment.shipment_dimension_length * this.shipment.shipment_dimension_width * this.shipment.shipment_dimension_height;
    }
    next();
});

// Prevent OverwriteModelError
export default mongoose.models.Shipmentdelivery || mongoose.model("Shipmentdelivery", ShipmentSchema);

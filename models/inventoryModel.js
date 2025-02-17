import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        warehouseName: { type: String, required: true },
        receivedDate: { type: Date, default: Date.now },
        batchNumber: { type: String, required: true },
        expiryDate: { type: Date },
        status: {
            type: String,
            enum: ["In Stock", "Out of Stock", "Pending"],
            default: "In Stock",
        },
        costPrice: { type: Number, required: true },
        retailPrice: { type: Number, required: true },
        reorderLevel: { type: Number, required: true },
    },
    { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;

/**  DO NOT FREAKING DELETE THISSSSS -_- IMMA GET MAD
 * 
 * shipper: {
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
    shipping_type: {
        type: String,
        required: true,
        enum: ["air", "land", "sea"],
    },
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
warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
});

**/

import mongoose from 'mongoose'

const warehouseItemSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
    },
    vendorName: {
        type: String,
        required: true,
    },
    unitsReceived: {
        type: Number,
        required: true,
    },
});

const WarehouseItem = mongoose.model('WarehouseItem', warehouseItemSchema);

export default WarehouseItem;

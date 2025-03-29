import PurchaseOrder from "../models/purchaseOrder.js";
import Procurement from "../models/procurement.js";
import Vendor from "../models/vendor.js";
import Product from "../models/product.js";

export const createPurchaseOrder = async (req, res) => {
    try {
        const {
            poNumber,
            orderDate,
            receiveDate,
            carrier,
            vendorId,
            shipTo,
            procurementId,
            rfqId,
            additionalNotes,
            products, // from frontend
            warehouse_id,
        } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "Products must be an array" });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const details = products.map((product) => {
            if (!product.productId || !product.description) {
                throw new Error("Product must include productId and description");
            }

            return {
                productId: product.productId,
                description: product.description,
                quantity: product.quantity,
                unitPrice: product.unitPrice,
                subTotal: product.quantity * product.unitPrice,
            };
        });

        const po = new PurchaseOrder({
            poNumber,
            orderDate,
            receiveDate,
            carrier,
            shipTo,
            procurementId,
            rfqId,
            vendorId,
            vendor: {
                businessName: vendor.businessName,
                businessAddress: vendor.businessAddress,
                contactNumber: vendor.contactNumber,
            },
            details,
            additionalNotes,
            warehouse_id,
        });

        await po.save();

        res.status(201).json({ message: "Purchase Order created successfully", po });
    } catch (error) {
        console.error("Error creating PO:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getPurchaseOrders = async (req, res) => {
    try {
        const { procurementId, vendorId } = req.query;

        let filter = {};
        if (procurementId) filter.procurementId = procurementId;
        if (vendorId) filter.vendorId = vendorId;

        const purchaseOrders = await PurchaseOrder.find(filter).populate("procurementId vendorId shipTo details.productId").exec();

        res.status(200).json(purchaseOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updatePurchaseOrder = async (req, res) => {
    try {
        const { purchaseOrderId } = req.params;
        const { status, paymentStatus, received } = req.body;

        const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        if (status) purchaseOrder.status = status;
        if (paymentStatus) purchaseOrder.paymentStatus = paymentStatus;
        if (received) purchaseOrder.received = received;

        await purchaseOrder.save();
        res.status(200).json(purchaseOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deletePurchaseOrder = async (req, res) => {
    try {
        const { purchaseOrderId } = req.params;

        const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        await purchaseOrder.remove();
        res.status(200).json({ message: "Purchase Order deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

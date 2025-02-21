import PurchaseOrder from "../models/purchaseOrder.js";
import Procurement from "../models/procurement.js";
import Vendor from "../models/vendor.js";
import Product from "../models/product.js";

// Create a new Purchase Order
export const createPurchaseOrder = async (req, res) => {
    try {
        const { procurementId, vendorId, items } = req.body;
        const procurement = await Procurement.findById(procurementId);
        if (!procurement) {
            return res.status(404).json({ message: "Procurement not found" });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        let totalAmount = 0;
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            item.totalPrice = item.quantity * item.unitPrice;
            totalAmount += item.totalPrice;
        }

        // Create Purchase Order
        const newPO = new PurchaseOrder({
            procurementId,
            vendorId,
            items,
            totalAmount,
            status: "Pending",
            paymentStatus: "Unpaid",
        });

        await newPO.save();
        res.status(201).json(newPO);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getPurchaseOrders = async (req, res) => {
    try {
        const { procurementId, vendorId } = req.query;

        let filter = {};
        if (procurementId) filter.procurementId = procurementId;
        if (vendorId) filter.vendorId = vendorId;

        const purchaseOrders = await PurchaseOrder.find(filter).populate("procurementId vendorId items.productId").exec();

        res.status(200).json(purchaseOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updatePurchaseOrder = async (req, res) => {
    try {
        const { purchaseOrderId } = req.params;
        const { status, paymentStatus } = req.body;

        const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        if (status) purchaseOrder.status = status;
        if (paymentStatus) purchaseOrder.paymentStatus = paymentStatus;

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

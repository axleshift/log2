import PurchaseOrder from "../models/purchaseOrder.js";

// Create Purchase Order
export const createPurchaseOrder = async (req, res) => {
    try {
        const { procurement, vendor, orderNumber, items, shipments, status, totalAmount, paymentStatus, payments } = req.body;

        const processedItems = items.map((item) => ({
            ...item,
            totalPrice: item.quantity * item.price,
        }));

        const newPurchaseOrder = new PurchaseOrder({
            procurement,
            vendor,
            orderNumber,
            items: processedItems,
            shipments,
            status,
            totalAmount,
            paymentStatus,
            payments,
        });

        const savedPurchaseOrder = await newPurchaseOrder.save();
        res.status(201).json(savedPurchaseOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Purchase Orders
export const getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find().populate("procurement", "title").populate("vendor", "fullName").populate("items.product", "itemName").populate("payments.vendor", "fullName").populate("shipments", "tracking_id");

        res.status(200).json(purchaseOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Purchase Order by ID
export const getPurchaseOrderById = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate("procurement", "title").populate("vendor", "fullName").populate("items.product", "itemName").populate("payments.vendor", "fullName").populate("shipments", "tracking_id");

        if (!purchaseOrder) return res.status(404).json({ message: "Purchase Order not found" });

        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Purchase Order Status
export const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(req.params.id, { status: req.body.status, updatedAt: Date.now() }, { new: true });

        if (!purchaseOrder) return res.status(404).json({ message: "Purchase Order not found" });

        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Purchase Order
export const deletePurchaseOrder = async (req, res) => {
    try {
        const deletedPurchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);

        if (!deletedPurchaseOrder) return res.status(404).json({ message: "Purchase Order not found" });

        res.status(200).json({ message: "Purchase Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a Payment to Purchase Order
export const addPaymentToPurchaseOrder = async (req, res) => {
    try {
        const { vendor, amount, method, status, transactionId, paymentDate } = req.body;
        const payment = { vendor, amount, method, status, transactionId, paymentDate };

        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(req.params.id, { $push: { payments: payment }, updatedAt: Date.now() }, { new: true });

        if (!purchaseOrder) return res.status(404).json({ message: "Purchase Order not found" });

        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

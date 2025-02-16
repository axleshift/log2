import PurchaseOrder from "../models/purchaseOrder";

// Create a new purchase order
export const createPurchaseOrder = async (req, res) => {
    try {
        const { vendor, items, totalAmount, invoice, additionalDocuments } = req.body;

        const purchaseOrder = new PurchaseOrder({
            vendor,
            items,
            totalAmount,
            invoice,
            additionalDocuments,
        });

        await purchaseOrder.save();

        res.status(201).json({ message: "Purchase Order created successfully", purchaseOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating purchase order", error });
    }
};

// Get purchase orders by status
export const getPurchaseOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const purchaseOrders = await PurchaseOrder.find({ status });

        res.status(200).json(purchaseOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchase orders", error });
    }
};

// Update the status of a purchase order
export const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });

        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        res.status(200).json({ message: "Purchase Order status updated", purchaseOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating purchase order status", error });
    }
};

// Attach invoice and documents to a purchase order
export const attachDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const { invoice, additionalDocuments } = req.body;

        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, { invoice, additionalDocuments, updatedAt: Date.now() }, { new: true });

        if (!purchaseOrder) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        res.status(200).json({ message: "Documents attached successfully", purchaseOrder });
    } catch (error) {
        res.status(500).json({ message: "Error attaching documents", error });
    }
};

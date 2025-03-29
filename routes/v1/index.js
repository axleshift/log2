import express from "express";
import auth from "./auth.js";
import warehouse from "./warehouse.js";
import tracking from "./tracking.js";
import logistics from "./logistics.js";
import inventory from "./inventory.js";
import profile from "./profile.js";
import vendor from "./vendor.js";
import product from "./product.js";
import RFQ from "./RFQ.js";
import bid from "./bid.js";
import Procurement from "./procurement.js";
import shipment from "./shipment.js";
import purchaseOrder from "./purchaseOrder.js";
import invoice from "./invoice.js";
import Department from "./department.js";
import Award from "./awardNotice.js";
import VendorQuotes from "./vendorQuotePending.js";
import Notification from "./notification.js";
import Announcement from "./announcement.js";
import inventoryRoutes from "./inventory.js";

const router = express.Router();

// Use routes
router.use("/auth", auth);
router.use("/warehouse", warehouse);
router.use("/tracking", tracking);
router.use("/logistics", logistics);
router.use("/inventory", inventory);
router.use("/profile", profile);
router.use("/vendor", vendor);
router.use("/product", product);
router.use("/inventory", inventoryRoutes);
router.use("/rfq", RFQ);
router.use("/bid", bid);
router.use("/procurement", Procurement);
router.use("/shipment", shipment);
router.use("/announcements", Announcement);
router.use("/purchaseOrder", purchaseOrder);
router.use("/notifications", Notification);
router.use("/invoice", invoice);
router.use("/department", Department);
router.use("/awards", Award);
router.use("/vendor-quotes", VendorQuotes);

export default router;

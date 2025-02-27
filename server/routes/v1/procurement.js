import express from "express";
import { createProcurement, getProcurements, getProcurementById, updateProcurementById, deleteProcurementById, approveProcurement, rejectProcurement } from "../../controller/procurement.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createProcurement);
router.get("/", tokenMiddleware, getProcurements);
router.get("/:id", getProcurementById);
router.put("/:id", updateProcurementById);
router.delete("/:id", deleteProcurementById);
router.patch("/:id/approve", approveProcurement);
router.patch("/:id/reject", rejectProcurement);

export default router;

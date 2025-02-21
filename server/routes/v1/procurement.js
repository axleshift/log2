import express from "express";
import {
    createProcurement,
    getProcurements,
    //   getAllProcurement,
    getProcurementById,
    updateProcurementById,
    deleteProcurementById,
    approveProcurement,
    rejectProcurement,
} from "../../controller/procurement.js";
import { tokenMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", tokenMiddleware, createProcurement);
router.get("/", getProcurements);
//router.get("/", getAllProcurement);
router.get("/:id", getProcurementById);
router.put("/:id", updateProcurementById);
router.delete("/:id", deleteProcurementById);
router.patch("/:procurementId/approve", approveProcurement);
router.patch("/:procurementId/reject", rejectProcurement);

export default router;

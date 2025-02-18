import express from "express";
import { createProcurement, getAllProcurements, getProcurementById, updateProcurementStatus, addQuoteToProcurement, addNegotiationToProcurement, deleteProcurement } from "../../controller/procurement.js";

const router = express.Router();

// Create a new procurement
router.post("/", createProcurement);

// Get all procurements
router.get("/", getAllProcurements);

// Get a procurement by ID
router.get("/:id", getProcurementById);

// Update procurement status
router.put("/:id/status", updateProcurementStatus);

// Add a quote to a procurement
router.post("/:id/quotes", addQuoteToProcurement);

// Add a negotiation to a procurement
router.post("/:id/negotiations", addNegotiationToProcurement);

// Delete a procurement
router.delete("/:id", deleteProcurement);

export default router;

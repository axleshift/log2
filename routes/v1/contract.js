import express from "express";

const router = express.Router();

import { createContract, getContracts, getContractById, updateContract, deleteContract } from "../../controller/contract.js";

router.post("/contracts", createContract);
router.get("/contracts", getContracts);
router.get("/contracts/:id", getContractById);
router.put("/contracts/:id", updateContract);
router.delete("/contracts/:id", deleteContract);

export default router;

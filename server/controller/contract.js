import Contract from "../models/contract.js";

// Create a new contract
export const createContract = async (req, res) => {
    try {
        const { vendorId, contractNumber, contractDetails, startDate, endDate, renewalDate, status } = req.body;

        const contract = new Contract({
            vendorId,
            contractNumber,
            contractDetails,
            startDate,
            endDate,
            renewalDate,
            status,
        });

        await contract.save();
        res.status(201).json({ message: "Contract created successfully", contract });
    } catch (err) {
        res.status(500).json({ message: "Error creating contract", error: err.message });
    }
};

// Get all contracts
export const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().populate("vendorId", "vendorName");
        res.status(200).json(contracts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching contracts", error: err.message });
    }
};

// Get a contract by ID
export const getContractById = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id).populate("vendorId", "vendorName");
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json(contract);
    } catch (err) {
        res.status(500).json({ message: "Error fetching contract", error: err.message });
    }
};

// Update a contract
export const updateContract = async (req, res) => {
    try {
        const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedContract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json({ message: "Contract updated successfully", updatedContract });
    } catch (err) {
        res.status(500).json({ message: "Error updating contract", error: err.message });
    }
};

// Delete a contract
export const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json({ message: "Contract deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting contract", error: err.message });
    }
};

import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["HR", "Finance", "Logistics", "Procurement", "IT", "Operations", "Marketing", "Legal"],
    },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

const Department = mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;

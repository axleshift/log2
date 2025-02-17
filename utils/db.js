import mongoose from "mongoose";
import VendorModel from "../models/vendor.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;

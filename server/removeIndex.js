import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.DB_URI;

const removeIndex = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection.db;
        const collection = db.collection("products");

        await collection.dropIndex("tracking_id_1");
        console.log("✅ Index 'tracking_id_1' removed successfully");
    } catch (error) {
        console.error("❌ Error removing index:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

// Run the function
removeIndex();

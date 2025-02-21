import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.DB_URI;

const removeIndex = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collection = db.collection("rfqs");

        // Check existing indexes
        const indexes = await collection.indexes();
        console.log("Existing Indexes:", indexes);

        // Drop the rfqNumber unique index if it exists
        await collection.dropIndex("rfqNumber_1");
        console.log("Index rfqNumber_1 removed successfully");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error removing index:", error.message);
    }
};

removeIndex();

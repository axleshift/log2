import mongoose from "mongoose";
import Vendor from "./models/vendor.js";
import User from "./models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const { DB_URI } = process.env;

const fixInvalidUserId = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB");

        // Find vendors with invalid `userId`
        const vendorsWithInvalidUserId = await Vendor.find({
            userId: { $exists: true, $not: { $type: "objectId" } },
        });

        for (let vendor of vendorsWithInvalidUserId) {
            const validUser = await User.findOne({ email: vendor.email });

            if (validUser) {
                // Update vendor with valid `userId`
                await Vendor.updateOne({ _id: vendor._id }, { $set: { userId: validUser._id } });
                console.log(`Updated vendor ${vendor.vendorId} with valid userId.`);
            } else {
                console.log(`No matching user found for vendor ${vendor.vendorId}.`);
            }
        }

        console.log("Fix process complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error during fix process:", error);
        process.exit(1);
    }
};

fixInvalidUserId();

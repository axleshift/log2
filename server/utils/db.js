import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURI = process.env.DB_URI;

if (!dbURI) {
    console.error("DB_URI is not defined in the .env file!");
    process.exit(1);
}

const connectWithRetry = (app) => {
    mongoose
        .connect(dbURI)
        .then(() => {
            const PORT = process.env.PORT || 5058;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error("MongoDB connection failed, retrying in 5 seconds...", err);
            setTimeout(() => connectWithRetry(app), 5000);
        });
};

export default connectWithRetry;

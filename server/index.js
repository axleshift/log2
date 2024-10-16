import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoute.js";
import invoiceRoutes from "./routes/invoiceRoute.js";
import truckingRoutes from "./routes/truckingRoute.js";
import inventoryRoutes from "./routes/inventoryRoute.js";

dotenv.config();

const app = express();

// Validate environment variables
const validateEnvVariables = () => {
    const { SECRET_KEY, NODE_ENV, DB_URI } = process.env;
    if (!SECRET_KEY || !NODE_ENV || !DB_URI) {
        throw new Error("Environment variables not set properly.");
    }
};

validateEnvVariables();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

// Connect to MongoDB
const dbURI = process.env.DB_URI;

const connectWithRetry = () => {
    mongoose
        .connect(dbURI)
        .then(() => {
            app.listen(process.env.PORT || 5058, () => {
                console.log(`Server running on port ${process.env.PORT || 5058}`);
            });
        })
        .catch((err) => {
            console.error("MongoDB connection failed, retrying in 5 seconds...", err);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Use routes
app.use("/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/trucking", truckingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Graceful shutdown
const shutdown = () => {
    mongoose.connection.close(() => {
        console.log("MongoDB connection closed due to application termination");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    shutdown();
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    shutdown();
});

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import connectWithRetry from "./utils/db.js";
import APIv1 from "./routes/v1/index.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import corsMiddleware from "./middleware/corsMiddleware.js";
import sessionMiddleware from "./middleware/session.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware setup
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(rateLimiter);
app.use(sessionMiddleware);
app.use(loggerMiddleware);

// Routes for APIv1
app.use("/api/v1/", APIv1);

// Error handling middleware
app.use(errorHandler);

// Start the MongoDB connection
connectWithRetry(app);

// Graceful shutdown
const shutdown = async () => {
    console.log("Shutting down gracefully...");
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
};

// Listen for termination signals
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

export default app;

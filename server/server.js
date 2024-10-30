import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import APIv1 from "./routes/v1/index.js";
import connectWithRetry from "./utils/db.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "Strict",
        },
    })
);

// Logging middleware
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

// Routes for APIv1
app.use("/api/v1/", APIv1);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error ${err.status || 500}: ${err.message} at ${req.method} ${req.originalUrl}`);
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    });
});

// Start the MongoDB connection
connectWithRetry(app);

// Graceful shutdown
const shutdown = async () => {
    logger.info("Shutting down gracefully...");
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });
};

// Listen for termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    shutdown();
});
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    shutdown();
});

export default app;

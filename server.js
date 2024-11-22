import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import APIv1 from "./routes/v1/index.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import corsMiddleware from "./middleware/corsMiddleware.js";
import sessionMiddleware from "./middleware/session.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

// Middleware
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

// Server
const PORT = process.env.PORT || 5058;
app.listen(PORT, async () => {
    // Connect to database
    await connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

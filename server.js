import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import APIv1 from "./routes/v1/index.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import corsMiddleware from "./middleware/corsMiddleware.js";
import sessionMiddleware from "./middleware/session.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./utils/db.js";
import { initializeSocket } from "./utils/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(sessionMiddleware);
app.use(loggerMiddleware);

// Routes for APIv1
app.use("/api/v1/", APIv1);

// Error handling middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5058;
server.listen(PORT, async () => {
    await connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (reason) => console.error(reason));

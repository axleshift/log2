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
import { GoogleGenerativeAI } from "@google/generative-ai";
import UserModel from "./models/UserModel.js";
import { tokenMiddleware } from "./middleware/authMiddleware.js";

const genAI = new GoogleGenerativeAI("AIzaSyD72fhdjwxqG-dDlctfe15TvbqoO8K-uN8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
app.post("/chatbot", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: "Query is required." });
        }

        // Prepare the prompt for the AI model
        const defaultQuery = query || "How can I assist you today?";

        const prompt = `
      You are a chatbot assisting with general queries. Use only the context below to answer.

      User query:
      ${defaultQuery}

      Instructions:
      - Provide clear, friendly responses based on the message context.
      - If the user asks anything unrelated to their account or specific roles, say you can only help with general inquiries.
    `;

        // Call the AI model to generate a response
        const result = await model.generateContent(prompt);
        const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.status(200).json({ result: response || "How can I assist you today?" });
    } catch (error) {
        console.error("Error in /chatbot:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});

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

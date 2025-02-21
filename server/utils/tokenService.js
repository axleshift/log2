import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

// Logger setup
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

if (!SECRET_KEY || !REFRESH_KEY) {
    throw new Error("Environment variables for secret keys are not set.");
}

export class TokenService {
    // Generate access token
    static generateAccessToken(user, expiresIn = "1h") {
        const payload = {
            userId: user._id,
            role: user.role,
            email: user.email,
        };
        return jwt.sign(payload, SECRET_KEY, { expiresIn });
    }

    // Generate refresh token
    static generateRefreshToken(user, expiresIn = "7d") {
        const payload = { userId: user._id };
        return jwt.sign(payload, REFRESH_KEY, { expiresIn });
    }

    // Verify access token
    static verifyAccessToken(token) {
        return this.verifyToken(token, SECRET_KEY);
    }

    // Verify refresh token
    static verifyRefreshToken(token) {
        return this.verifyToken(token, REFRESH_KEY);
    }

    // Token verification method
    static verifyToken(token, secret) {
        if (!token) {
            logger.warn("Token verification attempted without a token.");
            throw new Error("Token must be provided for verification.");
        }
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            this.handleTokenError(error);
        }
    }

    // Handle token errors
    static handleTokenError(error) {
        logger.error(`Token verification failed: ${error.message}`);
        if (error.name === "TokenExpiredError") {
            throw new Error("Token has expired.");
        }
        throw new Error("Invalid token.");
    }
}

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("Environment variable for the secret key is not set.");
}

export class TokenService {
    // Generate access token
    static generateAccessToken(payload, expiresIn = "1h") {
        return jwt.sign(payload, SECRET_KEY, { expiresIn });
    }

    // Verify access token
    static verifyAccessToken(token) {
        if (!token) {
            throw new Error("Token must be provided for verification.");
        }

        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            // Handle specific JWT errors
            if (error.name === "TokenExpiredError") {
                throw new Error("Token has expired.");
            }
            throw new Error("Invalid token.");
        }
    }
}

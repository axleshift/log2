import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const tokenMiddleware = (req, res, next) => {
    // Access the token from cookies or authorization header
    const token = req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ err: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            const message = err.name === "TokenExpiredError" ? "Token has expired" : "Unauthorized";
            return res.status(401).json({ err: message });
        }

        req.userId = decoded.userId; // Attach user ID to request
        next();
    });
};

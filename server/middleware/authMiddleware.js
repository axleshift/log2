import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const tokenMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"]; // Access the token from cookies

    if (!token) {
        return res.status(403).json({ err: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ err: "Token has expired" });
            }
            return res.status(401).json({ err: "Unauthorized" });
        }
        req.userId = decoded.userId; // Attach user ID to request
        next();
    });
};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Roles Middleware
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            console.warn("Unauthorized access attempt: Missing user information.");
            return res.status(401).json({ message: "Unauthorized: User information missing." });
        }

        const userRole = req.user.role;

        if (allowedRoles.includes(userRole)) {
            console.info(`Access granted to user with role: ${userRole}`);
            return next();
        }

        console.warn(`Access denied for user with role: ${userRole}`);
        return res.status(403).json({ message: "Access denied" });
    };
};

// Token Verification Middleware
export const tokenMiddleware = (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
        console.log("Extracted Token:", token);

        if (!token) {
            console.warn("Unauthorized access attempt: No token provided.");
            return res.status(401).json({ error: "Unauthorized: No token provided." });
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                const message = err.name === "TokenExpiredError" ? "Unauthorized: Token has expired." : "Unauthorized: Invalid token.";
                console.warn(`Token verification failed: ${message}`);
                return res.status(401).json({ error: message });
            }

            // Attach decoded user data to the request object
            req.user = {
                id: decoded.userId,
                role: decoded.role,
                email: decoded.email,
            };

            console.info(`Token verified successfully for user: ${decoded.userId}`);
            next();
        });
    } catch (error) {
        console.error("Error in token middleware:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

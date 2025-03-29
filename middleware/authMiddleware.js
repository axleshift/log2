import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
        console.log("Incoming request:", req.method, req.path);

        // Extract token
        const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
        // console.log("🟡 Extracted Token:", token);

        if (!token) {
            console.warn("Unauthorized access attempt: No token provided.");
            return res.status(401).json({ error: "Unauthorized: No token provided." });
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.warn("❌ Token verification failed:", err.message);
                return res.status(401).json({ error: "Unauthorized: Invalid token." });
            }

            // console.log("🟢 Decoded Token Data:", decoded);

            if (!decoded?.userId) {
                console.warn("❌ Invalid token payload: No userId found.");
                return res.status(401).json({ error: "Unauthorized: Invalid token payload." });
            }

            req.user = {
                id: decoded.userId,
                role: decoded.role || "user",
                email: decoded.email || null,
            };

            // console.info(`✅ Token verified successfully for user: ${req.user.id}`);
            next();
        });
    } catch (error) {
        console.error("❌ Error in token middleware:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const authenticateAdmin = (req, res, next) => {
    try {
        console.log("User Role:", req.user?.role);

        if (!req.user || !req.user.role || (req.user.role !== "admin" && req.user.role !== "super admin")) {
            console.warn("Forbidden: User does not have admin privileges.");
            return res.status(403).json({ status: "error", message: "Forbidden: Admins only" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error." });
    }
};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

//ROLES MIDDLEWARE
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            console.warn("Unauthorized access attempt detected.");
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

// Token verification middleware
export const tokenMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            const message = err.name === "TokenExpiredError" ? "Token has expired" : "Unauthorized access";
            return res.status(401).json({ error: message });
        }

        // Attach user data to the request object
        req.user = decoded;
        next();
    });
};

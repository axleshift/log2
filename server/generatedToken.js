import jwt from "jsonwebtoken";

// Secret key for signing the token (use your real secret for production)
const secretKey = "your-test-secret-key";

// Payload (claims) for the token
const payload = {
    username: "nachan", // This can be any ID or data for testing
    role: "admin", // You can add roles or permissions if needed
    email: "test@example.com",
};

// Options (like token expiration)
const options = {
    expiresIn: "1h", // Token expiration (1 hour in this case)
};

// Generate the token
const token = jwt.sign(payload, secretKey, options);

console.log("Generated Test Token:", token);

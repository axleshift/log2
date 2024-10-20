import crypto from "crypto";

// Function to generate a random key
function generateKey(length = 32) {
    return crypto.randomBytes(length).toString("hex");
}

// Generate secret key
const secretKey = generateKey(); // Default is 32 bytes
console.log("Secret Key:", secretKey);

// Generate refresh key
const refreshKey = generateKey(64); // You can adjust the length as needed
console.log("Refresh Key:", refreshKey);

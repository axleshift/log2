// Register Validation
export const registerValidation = (req, res, next) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ status: "error", message: "All fields are required." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ status: "error", message: "Invalid email format." });
    }
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ status: "error", message: "Username must be between 3 and 30 characters." });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: "error", message: "Password must be at least 6 characters." });
    }
    next();
};

// Login Validation
export const loginValidation = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ status: "error", message: "Username and password are required." });
    }
    if (password.length < 6) {
        return res.status(400).json({ status: "error", message: "Password must be at least 6 characters." });
    }
    next();
};

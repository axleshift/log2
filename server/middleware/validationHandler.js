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

// Forgot Password Validation
export const forgotPasswordValidation = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ status: "error", message: "Email is required." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ status: "error", message: "Invalid email format." });
    }
    next();
};

// OTP Validation
export const otpValidation = (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ status: "error", message: "Email and OTP are required." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ status: "error", message: "Invalid email format." });
    }
    if (otp.length !== 6) {
        return res.status(400).json({ status: "error", message: "OTP must be 6 digits." });
    }
    next();
};

// Change Password Validation
export const changePasswordValidation = (req, res, next) => {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
        return res.status(400).json({ status: "error", message: "OTP and new password are required." });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ status: "error", message: "New password must be at least 6 characters." });
    }
    if (otp.length !== 6) {
        return res.status(400).json({ status: "error", message: "OTP must be 6 digits." });
    }
    next();
};

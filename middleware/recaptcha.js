import fetch from "node-fetch";
import logger from "../utils/logger.js";

export const verifyRecaptcha = async (req, res, next) => {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
        logger.warn("reCAPTCHA token missing");
        return res.status(400).json({ status: "error", message: "reCAPTCHA verification required." });
    }

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaToken,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            logger.warn("reCAPTCHA verification failed");
            return res.status(400).json({ status: "error", message: "reCAPTCHA verification failed." });
        }

        logger.info("reCAPTCHA verification successful");
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        logger.error("Error during reCAPTCHA verification", { message: error.message });
        return res.status(500).json({ status: "error", message: "Error verifying reCAPTCHA" });
    }
};

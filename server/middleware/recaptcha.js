import fetch from "node-fetch";
import logger from "../utils/logger.js";

export const verifyRecaptcha = async (req, res, next) => {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
        logger.warn("reCAPTCHA token missing");
        return res.status(400).json({ status: "error", message: "reCAPTCHA verification required." });
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
        logger.error("RECAPTCHA_SECRET_KEY is not set");
        return res.status(500).json({ status: "error", message: "Server configuration error." });
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
          
        if (!response.ok) {
            logger.warn("Failed to verify reCAPTCHA", { status: response.status });
            return res.status(500).json({ status: "error", message: "Error verifying reCAPTCHA" });
        }

        const data = await response.json();
        console.log("reCAPTCHA response:", data); 
        
        if (!data.success || data.score < 0.5) {
          logger.warn("reCAPTCHA verification failed", { errorCodes: data["error-codes"], score: data.score });
          return res.status(400).json({ status: "error", message: "reCAPTCHA verification failed." });
        }
    

        logger.info("reCAPTCHA verification successful", { score: data.score });
        next();
    } catch (error) {
        logger.error("Error during reCAPTCHA verification", { message: error.message });
        return res.status(500).json({ status: "error", message: "Error verifying reCAPTCHA" });
    }
};

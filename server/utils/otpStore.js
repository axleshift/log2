import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

// Generate 6-digit OTP
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Your OTP for Registration",
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info("OTP sent to user:", { email });
    } catch (error) {
        logger.error("Error sending OTP to email:", error);
        throw new Error("Failed to send OTP");
    }
};

export const isOtpValid = (user, otp) => {
    return user.resetPasswordOtp === otp && Date.now() <= user.resetPasswordOtpExpires;
};

let otpStore = {};

// Store OTP and expiration in-memory
export const storeOtp = (email, otp) => {
    const expirationTime = Date.now() + 10 * 60 * 1000;
    otpStore[email] = { otp, expires: expirationTime };
};

// Retrieve stored OTP (for validation)
export const getOtp = (email) => {
    return otpStore[email];
};

export const clearOtp = (email) => {
    delete otpStore[email];
};

// SEND INVITE EMAIL
export const sendEmail = async (vendorEmail, rfqTitle, rfqId) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: vendorEmail,
        subject: `Invitation to submit a quote for RFQ: ${rfqTitle}`,
        html: `
        <p>Dear Vendor,</p>
        <p>You have been invited to submit a quotation for RFQ #${rfqId}: ${rfqTitle}.</p>
        <p>Please <a href="http://localhost:3000/procurement/rfqs/${rfqId}" target="_blank">click here</a> to view the full RFQ details and submit your quote.</p>
        <p>Best regards,</p>
        <p>Your Company</p>
      `,
    };

    return transporter.sendMail(mailOptions);
};

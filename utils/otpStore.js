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

// SEND RFQ INVITE
export const sendInviteEmail = async (vendorEmails, procurement, rfq) => {
    if (!vendorEmails || vendorEmails.length === 0) {
        console.error("❌ No vendor email provided.");
        return Promise.reject("No vendor email provided.");
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Logistics 2: Vendor Portal" <${process.env.EMAIL_USER}>`,
            to: Array.isArray(vendorEmails) ? vendorEmails.join(",") : vendorEmails, // Ensure it's a comma-separated string
            subject: `Invitation to Submit a Quote for RFQ #${rfq._id}`,
            html: `
                <p>Hello,</p>
                <p>You have been invited to submit a quote for the following RFQ:</p>
                <p><strong>Title:</strong> ${rfq.title || `RFQ for ${procurement.title}`}</p>
                <p><strong>Description:</strong> ${procurement.description}</p>
                <p><strong>Deadline:</strong> ${new Date(rfq.deadline).toLocaleString()}</p>
                <p>Please log in to the vendor portal to submit your quote.</p>
                <p>Best Regards,<br/>Procurement Team</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${vendorEmails}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

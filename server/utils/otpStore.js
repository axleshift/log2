import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

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
        subject: "Password Reset OTP",
        html: `<p>You requested a password reset</p><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    logger.info("OTP sent to user:", { email });
};

export const isOtpValid = (user, otp) => {
    return user.resetPasswordOtp === otp && Date.now() <= user.resetPasswordOtpExpires;
};

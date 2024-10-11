import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();
let otpStorage = {}; // Temporary storage for OTPs

const sendOtp = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStorage[email] = otp;

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}: ${otp}`);
  } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email not sent');
  }
};

router.post('/sendOtp', async (req, res) => {
    const { email } = req.body;
    try {
        await sendOtp(email);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

const verifyOtp = (email, inputOtp) => {
    const storedOtp = otpStorage[email];
    if (storedOtp && storedOtp === inputOtp) {
        delete otpStorage[email]; // Remove OTP after verification
        return true;
    }
    return false;
};

router.post('/verifyOtp', (req, res) => {
    const { email, otp } = req.body;
    const isValid = verifyOtp(email, otp);
    if (isValid) {
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

export default router;

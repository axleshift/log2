import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from './models/UserModel.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

const SECRET_KEY = process.env.SECRET_KEY;

// Connect to MongoDB
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3001, () => {
      console.log('Server is running on Port 3001 and connected to MongoDB');
    });
  })
  .catch((err) => {
    console.log('Server is not connected:', err);
  });

// User registration
app.post('/register', async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ email, username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});

// User login
app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  console.log('Attempting login for:', username);

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ err: 'Invalid Password' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.json({ msg: 'Login successfully', token });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});

// Send change password link endpoint
app.post('/ForgotPass', async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ err: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
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
      subject: 'Change your Password',
      text: `Change your password: http://localhost:3000/changePassword/${user._id}/${token}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send({ Status: 'Success', userId: user._id, resetToken: token });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});

// Change password endpoint
app.post('/changePassword/:id/:token', async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, SECRET_KEY, async (err) => {
    if (err) {
      return res.status(400).json({ Status: 'Error with token' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
      return res.json({ Status: 'Success' });
    } catch (updateErr) {
      next(updateErr); // Pass the error to the error handler
    }
  });
});

// Get for browser link
app.get('/changePassword/:id/:token', (req, res) => {
  const { id, token } = req.params;

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) {
      return res.status(400).json({ Status: 'Invalid token' });
    }

    res.json({ Status: 'Token is valid', userId: id });
  });
});

app.use(errorHandler);

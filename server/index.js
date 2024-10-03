import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from './models/adminSchema.js';
import dotenv from 'dotenv';
import { tokenMiddleware } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser'


// load env variables
dotenv.config();

// connect to express app
const app = express();
app.use(cors());
app.use(cookieParser());
// middleware
app.use(bodyParser.json());


const SECRET_KEY = process.env.SECRET_KEY;


// connect to mongoDB
const dbURI = 'mongodb+srv://nazzchwan:cookie123@cluster0.llxgf.mongodb.net/adminDB?retryWrites=true&w=majority&appName=Cluster0'
mongoose 
.connect(dbURI)
.then(() => {
    app.listen(3001, () => {
        console.log('Server is running to Port 3001 and connected to mongoDB')
    })
})
 .catch((err) => {
    console.log('Server is not Connected')
 })


//routes
// admin registration
//post register
app.post('/register', async ( req, res ) => {
    try {
        const { email, username , password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({ email, username, password: hashedPassword })
        await newAdmin .save()
        res.status(201).json({ msg: "Admin created successfully" })
    }
    catch(err) {
        res.status(500).json({ err: "Error signing up" })
    }
})
// get registered admin
app.get('/register', tokenMiddleware, async (req, res) => {
    try {
        const admins = await Admin.find();
        return res.status(200).json(admins); // Changed to 200
    } catch (err) {
        console.error(err); // Log error for debugging
        return res.status(500).json({ err: "Unable to get admins" });
    }
});


// get login 
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Attempting login for:", username);

        const admin = await Admin.findOne({ username });
        console.log("Admin found:", admin);

        if (!admin) {
            return res.status(401).json({ err: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ err: "Invalid Password" });
        }

        const token = jwt.sign({ userId: admin._id }, SECRET_KEY, { expiresIn: '1hr' });
        
        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookies
            secure: process.env.NODE_ENV === 'production', // Secure flag in production
            sameSite: 'strict', // Helps mitigate CSRF
            maxAge: 3600000 // 1 hour
        });

        // Send the response once
        return res.json({ msg: "Login successfully", token });
        
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ err: "Failed to Login" });
    }
});

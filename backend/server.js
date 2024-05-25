import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();
connectDB(); // MongoDB connection

const app = express();

const PORT = process.env.PORT || 5000;

// connects to cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// MIDDLEWARE
// " limit: '50mb' " is added to solve 'PayloadTooLargeError: request entity too large' error
app.use(express.json({limit: '50mb'})); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser()); // To parse cookies attached to the client's request in the 'req.cookies' object in your route handlers.


// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


app.listen(PORT, () => {
    console.log(`thread PORT ${PORT}`);
});
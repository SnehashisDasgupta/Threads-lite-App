import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB(); // MongoDB connection

const app = express();

const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser()); // To parse cookies attached to the client's request in the 'req.cookies' object in your route handlers.


// ROUTES
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
    console.log(`thread PORT ${PORT}`);
});
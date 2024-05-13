// MIDDLEWARE
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try {
        // to access the JWT token sent by the client in a cookie named "jwtToken" within the middleware
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized user" });

        // verify the token itself with the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // return just user without the password
        const user = await User.findById(decoded.userId).select("-password");

        // inside the request object, adding user field 
        req.user = user;

        next();
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in protectRoute: ", error.message);
    }
}

export default protectRoute;
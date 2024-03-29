import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const signupUser = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;
        //find whether User exist or not.
        const user = await User.findOne({ $or: [{email}, {username}]});

        // User already exists
        if (user) {
            return res.status(400).json({ message: "User already exists"});
        }

        //random value used in the hashing process to add complexity to the resulting hash
        const salt = await bcrypt.genSalt(10);
        //asynchronously hashes the user's plaintext password using bcrypt's hashing algorithm
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        if (newUser){
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
            });
        } else {
            res.status(400).json({ message: "Invalid user data "}); 
        }
        
    } catch (error) {
        res.statud(500).json({ message: error.message });
        console.log("Error in signupUser ", error.message);
    }
};

export { signupUser };
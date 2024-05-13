import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';

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
            // It generates a token for the newly created user's ID and sets it as a cookie in the response object (res).
            generateTokenAndSetCookie(newUser._id, res);

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

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        // compare given_password with database_password
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); 

        if (!user || !isPasswordCorrect) return res.status(400).json({ message: "Invalid username or password" });

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in loginUser: ", error.message);
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("jwtToken", "", {maxAge:1});
        res.status(200).json({ message: "User logged out successfully" });
        
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in logoutUser: ", error.message);
    }
}

const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        // if user wants to follow himself
        if(id === req.user._id) return res.status(400).json({ message: "You cannot follow/unfollow yourself" });

        if(!userToModify || !currentUser) return res.status(400).json({ message: "User not found" });

        // if user already followed the account
        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            //UNFOLLOW
            //modify currentUser following: remove user from following[] of currentUser
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            //modify 2ndUser's followers: remove user from followers[] of 2ndUser
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); 

            res.status(200).json({ message: "User unfollowed successfully" });

        } else {
            //FOLLOW
            //modify currentUser following: add user to following[] of currentUser
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            //modify 2ndUser's followers: add user to followers[] of 2ndUser
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } } );

            res.status(200).json({ message: "User followed successfully" })
            
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in followUnFollowUser: ", error.message);
    }
};

export { signupUser, loginUser, logoutUser, followUnFollowUser };
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
  //We will fetch user profile with username or userId
  // query is either username or userId
  const { query } = req.params;

  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      // find 'userId' from 'User' collection excluding password and updatedAt fields.
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updated");
    } else {
      // query is username
      // find 'username' from 'User' collection excluding password and updatedAt fields.
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    //find whether User exist or not.
    const user = await User.findOne({ $or: [{ email }, { username }] });

    // User already exists
    if (user) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
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
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      // It generates a token for the newly created user's ID and sets it as a cookie in the response object (res).
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data " });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signupUser ", error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // compare given_password with database_password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    if (user.isFrozen){
      user.isFrozen = false;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwtToken", "", { maxAge: 1 });
    res.status(200).json({ error: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logoutUser: ", error.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    // if user wants to follow himself
    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    // if user already followed the account
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
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
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in followUnFollowUser: ", error.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  // profilePic is null by default and can be updated later
  let { profilePic } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    //Ensure the logged-in user can only update their own profile
    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    // CHeck if the new username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() != userId.toString()) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      //if profilePic already present
      if (user.profilePic) {
        // delete the old one and upload the new one
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      // upload new profilePic to Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    //password should be null
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    // exclude currentUser and users that currentUser is already following
    const userId = req.user._id; //currentUser

    //returns userId stored in following array of currentUser
    const usersFollowedByYou = await User.findById(userId).select("following");

    // give 10 users from userModel except the currentUser
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // except currentUser
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    // select userId from 'users' whom the currentUser doesn't follows
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedusers = filteredUsers.slice(0, 4); //only show 4 users from filteredUsers
    suggestedusers.forEach((user) => (user.password = null)); // dont return password

    res.status(200).json(suggestedusers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isFrozen = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
};

import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: "PostedBy and text fields are required" });
        }

        const user = await User.findById(postedBy);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        // user cannot create post for other user.
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized to create post" });
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        res.status(201).json({ message: "Post created successfully ", newPost });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ post });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in getPost: ", err.message);
    }
};

export { createPost, getPost };
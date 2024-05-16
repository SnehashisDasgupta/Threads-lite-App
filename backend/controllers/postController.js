import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const following = user.following;

        // get all the posts of the users whom currentUser follows
        const feedPosts = await Post.find({ postedBy: {$in:following}}).sort({createdAt: -1});

        res.status(200).json({ feedPosts });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in getFeedPosts: ", err.message);
    }
}

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

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //user cannot delete other user's post.
        if (post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized to delete post" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in deletePost: ", err.message);
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //if userId present in like array, means user already liked the post
        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            // Unlike post
            // remove the userId from like array
            await Post.updateOne({ _id:postId }, {$pull: { likes: userId } });
            res.status(200).json({ message: "Post disliked successfully" });

        }else{
            // Like post
            // add userId in the like array
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }
        
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in likeUnlikePost: ", err.message);
    }
}

const replyToPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        // if no text is given in comments then it will not work
        if(!text) {
            return res.json(400).json({ message: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const reply = { userId, text, userProfilePic, username };
        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply added successfully", post });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in replyToPost: ", err.message);
    }
}

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import useGetLoader from "../hooks/useGetLoader";
import Loader from "../components/loader/Loader";
import Post from "../components/Post";

const HomePage = () => {
  const { loader } = useGetLoader();
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getFeedPost = async () => {
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
        
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }

    getFeedPost();
  }, [showToast]);

  return (
    <>
      {/* If user doesn't follow anyone */}
      {!loader && posts.length === 0 && 
        <h1>Follow someone to see the feed</h1>
      }

      {loader && [...Array(posts.length)].map((_, idx) => <Loader key={idx} />)}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ) )}

    </>
  );
}

export default HomePage;
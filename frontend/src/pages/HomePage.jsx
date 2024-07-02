import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import useGetLoader from "../hooks/useGetLoader";
import Loader from "../components/loader/Loader";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";

const HomePage = () => {
  const { loader } = useGetLoader();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom);

  useEffect(() => {
    const getFeedPost = async () => {
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }

    getFeedPost();
  }, [showToast, setPosts]);

  return (
    <>
      {/* If loader is true, show the loader */}
      {loader && [...Array(posts.length)].map((_, idx) => <Loader key={idx} />)}

      {/* If user doesn't follow anyone */}
      {!loader && posts.length === 0 &&
        <h1>Follow someone to see the feed</h1>
      }

      {/* If loader is false and there are posts, show the posts */}
      {!loader && posts.length > 0 && (
        posts.map((post) => (
          <Post
           key={post._id} post={post} postedBy={post.postedBy} />
        )
        )
      )}
    </>
  );
}

export default HomePage;
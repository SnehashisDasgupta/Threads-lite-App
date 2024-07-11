import { useEffect, useState } from "react";
import Post from "../components/Post";
import useShowToast from '../hooks/useShowToast';
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Bookmark = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const { loader } = useGetLoader();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {

      if (!currentUser) {
        showToast("Error", "User not authenticated", "error");
        return;
      }

      try {
        // function retrieves an array of all keys (strings) stored in the localStorage
        const keys = Object.keys(localStorage);
        // Filter keys [posts] that matches the currentUser._id [gives the posts, bookmarked by the currentUser]
        const bookmarkedPostIds = keys.filter(key => key.startsWith('isBookmarked-') && key.endsWith(`-${currentUser._id}`) && JSON.parse(localStorage.getItem(key)));

        const postPromises = bookmarkedPostIds.map(async (key) => {
          const postId = key.split('-')[1];
          try {
            const res = await fetch(`/api/posts/${postId}`);
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return null;
            }
            return data;
          } catch (error) {
            console.error(`Error fetching post ${postId}: ${error.message}`);
            return null;
          }
        });

        const posts = await Promise.all(postPromises);
        const filteredPosts = posts.filter(post => post !== null);
        setBookmarkedPosts(filteredPosts);

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    fetchBookmarkedPosts();
  }, [showToast, currentUser]);


  return (
    <>
      {bookmarkedPosts.length === 0 &&
        <h1>No bookmarked posts found.</h1>
      }

      {loader && [...Array(3)].map((_, idx) => <Loader key={idx} />)}

      {!loader && bookmarkedPosts.length > 0 && (
        bookmarkedPosts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      )}
    </>
  );
};

export default Bookmark;

import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";

const UserPage = () => {
  const { username } = useParams();
  const { loader } = useGetLoader();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // useEffect triggers when username changes
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);

      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
        
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      }
    }

    getUser();
    getPosts();
  }, [username, showToast]);

  if (!user && loader) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size='xl' />
      </Flex>
    )
  }
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      {loader && [...Array(posts.length)].map((_, idx) => <Loader key={idx} />)}

      {!loader && posts.length===0 &&
        <h1>User has not posts</h1>
      }

      {!loader && posts.length > 0 && (
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      )}
    </>
  );
};

export default UserPage
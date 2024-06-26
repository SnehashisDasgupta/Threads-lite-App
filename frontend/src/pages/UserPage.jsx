import { useEffect } from "react";
import UserHeader from "../components/UserHeader"
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";

const UserPage = () => {
  const {loading, user} = useGetUserProfile();
  const { username } = useParams();
  const { loader } = useGetLoader();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom);

  // useEffect triggers when username changes
  useEffect(() => {

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

    getPosts();
  }, [username, showToast, setPosts]);

  console.log(posts)

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
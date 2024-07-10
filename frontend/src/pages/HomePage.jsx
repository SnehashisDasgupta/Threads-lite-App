import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import useGetLoader from "../hooks/useGetLoader";
import Loader from "../components/loader/Loader";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FaUserPlus } from "react-icons/fa";
import SuggestedUsers from "../components/SuggestedUsers";

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
    <Flex gap={10} alignItems={"flex-start"} flexDir={{ base: "column", md: "row" }}>

      {/* Suggested User */}
      <Box
        flex={{ base: "none", md: 30 }}
        order={{ base: 0, md: 1 }}
        w={{ base: "80%", md: "auto" }}
        ml={10}
      >
        <SuggestedUsers />
      </Box>

      {/* Posts */}
      <Box flex={{ base: "none", md: 70 }} order={{ base: 1, md: 0 }} w={{ base: "100%", md: "auto" }}>
        {/* If loader is true, show the loader */}
        {loader && [...Array(3)].map((_, idx) => <Loader key={idx} />)}

        {/* If user doesn't follow anyone */}
        {!loader && posts.length === 0 &&
          <Flex
            flex={65}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <FaUserPlus size={100} />
            <Text fontSize={20}>Please follow someone to see post</Text>
          </Flex>
        }

        {/* If loader is false and there are posts, show the posts */}
        {!loader && posts.length > 0 && (
          posts.map((post) => (
            <Post
              key={post._id} post={post} postedBy={post.postedBy} />
          )
          )
        )}
      </Box>
    </Flex>
  );
}

export default HomePage;
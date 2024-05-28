import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { FaRegBookmark } from "react-icons/fa";
import Actions from "../components/Actions";
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const PostPage = () => {
  const { loader } = useGetLoader();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);

  const [post, setPost] = useState(null);
  const { user } = useGetUserProfile();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost(data);

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }

    getPost();
  }, [showToast, pid])

  const handleDeletePost = async (e) => {
    try {
        // the whole POST is a link so, when deletePost clicked, it doesn't reloads the page
        e.preventDefault();

        if (!window.confirm("Are you sure you want to delete the post?")) return;
        
        const res = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");

        showToast("Success", "Post deleted", "success");

    } catch (error) {
        showToast("Error", error.message, "error");
    }
};

  if (!post) return null;

  return (
    <>
      {loader && [...Array(1)].map((_, idx) => <Loader key={idx} />)}
      {!loader && (
        <>
          <Flex my={5}>
            <Flex w={"full"} alignItems={"center"} gap={3}>
              {/* ProfilePic */}
              <Avatar src={user.profilePic} size={"md"} name={user.name} 
                cursor={"pointer"}
                // when click 'Avatar' it will navigate to the profilePage
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`)
              }}
              />
              <Flex>
                {/* username */}
                <Text fontSize={"sm"} fontWeight={"bold"}
                  cursor={"pointer"}
                  // when click 'username' it will navigate to the profilePage
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`)
                }}
                >
                  {user.username}
                </Text>
                {/* BlueTick */}
                <Image src="/verified.png" w={4} h={4} ml={4} />
              </Flex>
            </Flex>

            {/* time[when the post is uploaded] and threeDots */}
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              <FaRegBookmark
                title="Bookmark"
                onClick={(e) => {
                  // it will not trigger the parent 'Link' tag , and will only trigger 'postSave()' function
                  e.preventDefault();
                  showToast("Post Saved", "", "success");
                }}
              />

              {currentUser?._id === user?._id &&
                <DeleteIcon 
                  cursor={"pointer"}
                  onClick={handleDeletePost} 
                />
              }

            </Flex>
          </Flex>


          <Text py={1} my={2} fontSize={"sm"}>{post.text}</Text>

          {post.img && (

            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          {/* Action icons */}
          <Flex gap={3} my={3}>
            <Actions post={post} />
          </Flex>

          {/* A thin line to divide the post from comment section */}
          <Divider my={4} />

          <Flex justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"2xl"}>👋</Text>
              <Text color={"gray.light"}>Add a comment</Text>
            </Flex>
            <Button>Get</Button>
          </Flex>

          {/* A thin line to divide the post from comment section */}
          <Divider my={4} />

          {/* <Comment
            userAvatar="https://bit.ly/dan-abramov"
            username="choudhurysayan"
            comment="Looks really good..."
            createdAt="1d"
            likes={22}
          /> */}
        </>
      )}

    </>
  )
}

export default PostPage
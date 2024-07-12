import { Avatar, Box, Button, Divider, Flex, Image, Input, Text } from "@chakra-ui/react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
import useBookmark from "../hooks/useBookmark";
import { IoSendSharp } from "react-icons/io5";

const PostPage = () => {
  const { loader } = useGetLoader();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);

  const [posts, setPosts] = useRecoilState(postAtom);
  const { user } = useGetUserProfile();
  const [isBookmarked, toggleBookmark] = useBookmark(pid);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);

      } catch (error) {
        showToast("Error", error.message, "error");
      }
    }

    getPost();
  }, [showToast, pid, setPosts])


  const currentPost = posts[0];

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete the post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      showToast("Success", "Post deleted", "success");
      navigate(`${user.username}`);

    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handlePostComment = async () => {
    if (!currentUser) return showToast("Error", "You must be logged in to give comment on a post", "error");

    setLoading(true);
    setComment("");
    try {
      const res = await fetch(`/api/posts/reply/${currentPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === currentPost._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (!currentPost) return null;

  return (
    <>
      {loader && <Loader />}
      {!loader && (
        <>
          <Flex my={5}>
            <Flex w={"full"} alignItems={"center"} gap={3}>
              {/* ProfilePic */}
              <Avatar src={user?.profilePic} size={"md"} name={user?.name}
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
                    navigate(`/${user?.username}`)
                  }}
                >
                  {user?.username}
                </Text>
                {/* BlueTick */}
                <Image src="/verified.png" w={4} h={4} ml={4} />
              </Flex>
            </Flex>

            {/* time[when the post is uploaded] and threeDots */}
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
              </Text>

              {/* current user cannot save his own post and cannot delete other's post */}
              {currentUser?._id !== user?._id ? (
                // BOOKMARK 
                isBookmarked ? (
                  <FaBookmark
                    title="Unmark"
                    cursor={"pointer"}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark();
                    }}
                  />
                ) : (
                  <FaRegBookmark
                    title="Mark"
                    cursor={"pointer"}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark();
                    }}
                  />
                )
              ) : (
                currentUser?._id === user?._id &&
                <DeleteIcon
                  title="Delete Post"
                  cursor={"pointer"}
                  onClick={handleDeletePost}
                />
              )}


            </Flex>
          </Flex>


          <Text py={1} my={2} fontSize={"sm"}>{currentPost.text}</Text>

          {currentPost.img && (

            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={currentPost.img} w={"full"} />
            </Box>
          )}

          {/* Action icons */}
          <Flex gap={3} my={3}>
            <Actions post={currentPost} />
          </Flex>

          {/* A thin line to divide the post from comment section */}
          <Divider my={4} />

          <Flex justifyContent={"space-between"} alignItems={"center"} gap={2}>
            <Flex flex={1} gap={2} alignItems={"center"}>
              <Text fontSize="2xl">👋</Text>
              <Input
                variant="unstyled"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Flex>

            <Button
              isLoading={loading}
              onClick={handlePostComment}
              isDisabled={!comment.trim()}
            >
              <IoSendSharp />
            </Button>
          </Flex>

          {/* A thin line to divide the post from comment section */}
          <Divider my={4} />

          {currentPost.replies.map((reply) => (
            <Comment
              key={reply._id}
              reply={reply}
              // if it is last reply then don't show 'divider line'
              lastReply={reply?._id === currentPost?.replies[currentPost?.replies.length - 1]._id}
            />
          ))}
        </>
      )}

    </>
  )
}

export default PostPage
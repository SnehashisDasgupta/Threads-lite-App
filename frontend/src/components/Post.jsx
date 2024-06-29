import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { FaRegBookmark } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from '../hooks/useShowToast';

import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";

const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
    
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error")
                setUser(null);
            }
        }

        getUser();
    }, [postedBy, showToast]);

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
            // once deleted a post, no need to refresh the page to see the changes
            setPosts(posts.filter((p) => p._id !== post._id));

        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return (
        <Link to={`/${user?.username}/post/${post?._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    
                    {/* admin user profilePic */}
                    <Avatar size={"md"} name={user?.name} src={user?.profilePic} 
                        // when click 'Avatar' it will navigate to the profilePage
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`)
                        }}
                    />

                    {/* line on the left side of every post */}
                    {/* ------------------------------------------------------ */}
                    <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>

                    {/* avatars of users who commented */}
                    <Box position={"relative"} w={"full"}>
                        {/* if there is no replies then show '✒' */}
                        {post.replies.length===0 && 
                            <Text textAlign={"center"}>✒</Text>
                        }

                        {/* shows profilePic of top 3 users who replied in the post */}
                        {post.replies[0] && (
                            <Avatar 
                                size={"xs"} 
                                name={post.replies[0].username}
                                src={post.replies[0].userProfilePic}
                                position={"absolute"} 
                                top={"-12px"} 
                                left={"15px"} 
                                padding={"2px"} 
                            />   
                        )}
                        {post.replies[1] && (
                            <Avatar 
                                size={"xs"} 
                                name={post.replies[1].username}
                                src={post.replies[1].userProfilePic} 
                                position={"absolute"} 
                                top={"-12px"} 
                                left={"7px"} 
                                padding={"2px"} 
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar 
                                size={"xs"} 
                                name={post.replies[2].username}
                                src={post.replies[2].userProfilePic} 
                                position={"absolute"} 
                                top={"-12px"} 
                                left={"-1px"} 
                                padding={"2px"} 
                            />
                        )}
                    </Box>
                </Flex>


                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        {/* admin username and blue_tick[verified] */}
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}
                                // when click 'username' it will navigate to the profilePage
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`)
                                }}
                            >
                                {user?.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
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

                    {/* post title or caption */}
                    <Text fontSize={"sm"}>{post.text}</Text>

                    {/* Post image */}
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    {/* Action icons */}
                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                    
                </Flex>
            </Flex>
        </Link>
    )
}

export default Post
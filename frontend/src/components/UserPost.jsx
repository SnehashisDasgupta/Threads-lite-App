import { Avatar, Box, Flex, Image, Text, useToast } from "@chakra-ui/react"
import { FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom"
import Actions from "./Actions";
import { useState } from "react";

const UserPost = ({ likes, replies, postImg, postTitle }) => {
  const [liked, setLiked] = useState(false);
  const toast = useToast();

  const postSave = () => {
    const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            // show a pop-up message
            toast({
                description: "Saved post.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        });
  }

  return (
    <Link to={"/dasguptasnehashis/post/001"}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                {/* admin user profilePic */}
                <Avatar size={"md"} name="Snehashis Dasgupta" src="/avatar.jpg" />

                {/* line on the left side of every post */}
                <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>

                {/* avatars of users who commented */}
                <Box position={"relative"} w={"full"}>
                    <Avatar size={"xs"} name="Kent Clark" src="https://bit.ly/kent-c-dodds" position={"absolute"} top={"0px"} left={"15px"} padding={"2px"} />
                    <Avatar size={"xs"} name="Dan Abrahmov" src="https://bit.ly/dan-abramov" position={"absolute"} bottom={"0px"} right={"-5px"} padding={"2px"} />
                    <Avatar size={"xs"} name="Qurto Medwa" src="https://bit.ly/code-beast" position={"absolute"} bottom={"0px"} left={"4px"} padding={"2px"} />
                </Box>
            </Flex>

            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    {/* admin username and blue_tick[verified] */}
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            dasguptasnehashis
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                    {/* time[when the post is uploaded] and threeDots */}
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"sm"} color={"gray.light"}>
                            1d
                        </Text>

                        <FaRegBookmark onClick={(e) => {
                            // it will not trigger the parent 'Link' tag , and will only trigger 'postSave()' function
                            e.preventDefault();
                            postSave();
                        }} />         
                                
                    </Flex>
                </Flex>

                {/* post title or caption */}
                <Text fontSize={"sm"}>{ postTitle }</Text>

                {/* Post image */}
                {postImg && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                        <Image src={ postImg } w={"full"} />
                    </Box>
                )}

                {/* Action icons */}
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked} />
                </Flex>

                {/* replies and likes */}
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>
                        { replies } replies
                    </Text>

                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>

                    <Text color={"gray.light"} fontSize={"sm"}>
                        { likes } likes
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost
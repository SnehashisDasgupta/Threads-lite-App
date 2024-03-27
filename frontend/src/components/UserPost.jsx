import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { BsThreeDots } from 'react-icons/bs';
import Actions from "./Actions";
import { useState } from "react";

const UserPost = () => {
  const [liked, setLiked] = useState(false);

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
                        <BsThreeDots />
                    </Flex>
                </Flex>

                {/* post title or caption */}
                <Text fontSize={"sm"}>This is my first post</Text>
                {/* Post image */}
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src="/post0.jpg" w={"full"} />
                </Box>

                {/* Action icons */}
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked} />
                </Flex>

                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>12 replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                    <Text color={"gray.light"} fontSize={"sm"}>34 likes</Text>
                </Flex>
            </Flex>
        </Flex>
    </Link>
  )
}

export default UserPost
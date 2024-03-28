import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({ userAvatar, username, comment, likes, createdAt}) => {
    const [liked, setLiked] = useState(false);

  return (
    <>
        <Flex gap={4} py={2} my={2} w={"full"}>
            <Avatar src={userAvatar} size={"sm"} />

            <Flex gap={1} w={"full"} flexDirection={"column"}>

                <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        { username }
                    </Text>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}>
                            { createdAt }
                        </Text>
                        <BsThreeDots cursor={"pointer"} />
                    </Flex>

                </Flex>

                <Text>{ comment }</Text>
                {/* like, comment, repost, share icons */}
                <Actions liked={liked} setLiked={setLiked} />
                <Text fontSize={"sm"} color={"gray.light"}>
                    {likes + (liked ? 1 : 0)} likes
                </Text>
            </Flex>

        </Flex>

        <Divider />
    </>
  )
}

export default Comment
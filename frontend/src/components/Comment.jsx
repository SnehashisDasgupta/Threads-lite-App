import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ reply, lastReply }) => {
    if (!reply.createdAt) {
        return null; // Handle case where createdAt is missing or invalid
    }
    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={reply?.userProfilePic} size={"sm"} />

                <Flex gap={1} w={"full"} flexDirection={"column"}>

                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {reply?.username}
                        </Text>

                        {/* Display time ago */}
                        <Text fontSize={"xs"} color={"gray.500"}>
                            {formatDistanceToNow(new Date(reply.createdAt))} ago
                        </Text>

                    </Flex>

                    <Text>{reply.text}</Text>
                </Flex>

            </Flex>
            {!lastReply ? <Divider /> : null}
        </>
    )
}

export default Comment;

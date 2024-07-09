import { Avatar, Box, Flex, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messagesAtom"
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ message, ownMessage }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const currentUser = useRecoilValue(userAtom);

    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-end"}>
                    <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                        <Text color={"white"}>{message.text}</Text>
                        {/* Blue tick: seen msg */}
                        <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                            <BsCheck2All size={16} />
                        </Box>
                    </Flex>
                    <Avatar src={currentUser.profilePic} w={7} h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />

                    <Text maxW={"350px"} bg={"gray.700"} color={"white"} p={1} borderRadius={"md"}>
                        {message.text}
                    </Text>
                </Flex>
            )}
        </>
    )
}

export default Message
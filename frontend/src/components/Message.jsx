import { Avatar, Flex, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messagesAtom"
import userAtom from "../atoms/userAtom";

const Message = ({ message, ownMessage }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const currentUser = useRecoilValue(userAtom);

    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-end"}>
                    <Text maxW={"350px"} bg={"red.700"} color={"white"} p={1} borderRadius={"md"}>
                        { message.text }
                    </Text>
                    <Avatar src={currentUser.profilePic} w={7} h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />

                    <Text maxW={"350px"} bg={"gray.600"} color={"white"} p={1} borderRadius={"md"}>
                        { message.text }
                    </Text>
                </Flex>
            )}
        </>
    )
}

export default Message
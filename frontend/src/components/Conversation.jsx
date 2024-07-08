import { Avatar, AvatarBadge, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
    const currentUser = useRecoilValue(userAtom);
    // get the otherUser 
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const colorMode = useColorMode();

    return (
        <Flex gap={4} alignItems={"center"} p={1}
            _hover={{
                cursor: "pointer",
                bg: useColorModeValue("gray.400", "gray.dark"),
                color: "white",
            }}
            borderRadius={"md"}
            onClick={() => setSelectedConversation({
                _id: conversation._id,
                userId: user._id,
                username: user.username,
                userProfilePic: user.profilePic,
                mock: conversation.mock,
            })
            }
            bg={
                selectedConversation?._id === conversation._id ?
                    (colorMode === "light" ? "gray.200" : "gray.dark")
                    : ""
            }
        >
            <WrapItem>
                <Avatar
                    size={"md"}
                    src={user.profilePic}
                >
                    {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
                </Avatar>
            </WrapItem>

            <Stack direction={"column"} fontSize={"sm"}>
                <Text fontWeight={700} display={"flex"} alignItems={"center"}>
                    {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>

                <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                    {/* if lastMessage is send by currentUser then show doubleTick icon before lastMessage */}
                    {currentUser._id === lastMessage.sender ?
                        <BsCheck2All size={16} /> : ""
                    }

                    {/* only show first 20 characters of the lastMessage if it exceeds 20 characters in conversation */}
                    {lastMessage.text.length > 20 ? lastMessage.text.substring(0, 20) + "..." : lastMessage.text}
                </Text>
            </Stack>
        </Flex>
    )
}

export default Conversation
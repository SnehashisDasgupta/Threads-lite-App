import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
    const currentUser = useRecoilValue(userAtom);
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const { colorMode } = useColorMode();

    const handleConversationClick = () => {
        setSelectedConversation({
            _id: conversation._id,
            userId: user._id,
            username: user.username,
            userProfilePic: user.profilePic,
            mock: conversation.mock,
        });
    };

    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={1}
            _hover={{
                cursor: "pointer",
                bg: useColorModeValue("gray.400", "gray.dark"),
                color: "white",
            }}
            borderRadius={"md"}
            onClick={handleConversationClick}
            bg={selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.200" : "gray.dark") : ""}
        >
            <WrapItem>
                <Avatar size={"md"} src={user.profilePic}>
                    {isOnline && <AvatarBadge boxSize={"1em"} bg={"green.500"} />}
                </Avatar>
            </WrapItem>

            <Stack direction={"column"} fontSize={"sm"}>
                <Flex alignItems={"center"}>
                    <Text fontWeight={700}>
                        {user.username}
                    </Text>
                    <Image src="/verified.png" w={4} h={4} ml={1} />
                </Flex>

                <Flex alignItems={"center"} gap={1}>
                    {currentUser._id === lastMessage.sender && (
                        <Box color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Box>
                    )}
                    <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>

                        {
                            lastMessage.text.length > 20 ? `${lastMessage.text.substring(0, 20)}...` : lastMessage.text || <BsFillImageFill size={16} />
                        }
                    </Text>
                </Flex>
            </Stack>
        </Flex>
    );
};

export default Conversation;

import { Avatar, Box, Flex, Image, Modal, ModalBody, ModalContent, ModalOverlay, Skeleton, Text, useDisclosure } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messagesAtom"
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const ImageModal = ({ isOpen, onClose, imgSrc }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalBody p={0}>
                    <Image src={imgSrc} objectFit={"contain"} />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const Message = ({ message, ownMessage }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const currentUser = useRecoilValue(userAtom);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-end"}>
                    {/* if message is text */}
                    {message.text && (
                        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                            <Text color={"white"}>{message.text}</Text>
                            {/* Blue tick: seen msg */}
                            <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                                <BsCheck2All size={16} />
                            </Box>
                        </Flex>
                    )}

                    {/* if message is image */}
                    {message.img && !imgLoaded && (
                        // img skeleton
                        <Flex mt={5} w={"150px"}>
                            <Image
                                src={message.img}
                                hidden
                                onLoad={() => setImgLoaded(true)}
                                alt="image"
                                borderRadius={4}
                            />
                            <Skeleton w={"200px"} h={"150px"} />
                        </Flex>
                    )}

                    {message.img && imgLoaded && (
                        <>
                            <Flex
                                mt={5}
                                w={"200px"}
                                borderWidth={3}
                                borderRadius={4}
                                borderColor={"green.800"}
                                cursor={"pointer"}
                                onClick={onOpen}
                            >
                                <Image
                                    src={message.img}
                                    alt="image"
                                    borderRadius={4}
                                />
                                <Box
                                    alignSelf={"flex-end"}
                                    ml={1}
                                    color={message.seen ? "blue.400" : ""}
                                    fontWeight={"bold"}
                                >
                                    <BsCheck2All size={16} />
                                </Box>
                            </Flex>

                            <ImageModal isOpen={isOpen} onClose={onClose} imgSrc={message.img} />
                        </>
                    )}

                    <Avatar src={currentUser.profilePic} w={7} h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />

                    {message.text && (
                        <Text
                            maxW={"350px"}
                            bg={"gray.700"}
                            color={"white"}
                            p={1}
                            borderRadius={"md"}
                        >
                            {message.text}
                        </Text>
                    )}

                    {/* if message is image */}
                    {message.img && !imgLoaded && (
                        // img skeleton
                        <Flex mt={5} w={"150px"}>
                            <Image
                                src={message.img}
                                hidden
                                onLoad={() => setImgLoaded(true)}
                                alt="image"
                                borderRadius={4}
                            />
                            <Skeleton w={"200px"} h={"150px"} />
                        </Flex>
                    )}

                    {message.img && imgLoaded && (
                        <>
                            <Flex
                                mt={5}
                                w={"200px"}
                                borderWidth={3}
                                borderRadius={4}
                                borderColor={"green.800"}
                                cursor={"pointer"}
                                onClick={onOpen}
                            >
                                <Image
                                    src={message.img}
                                    alt="image"
                                    borderRadius={4}
                                />
                            </Flex>

                            <ImageModal isOpen={isOpen} onClose={onClose} imgSrc={message.img} />
                        </>
                    )}
                </Flex>
            )}
        </>
    )
}

export default Message;
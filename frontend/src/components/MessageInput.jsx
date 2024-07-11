import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
    const [messageText, setMessageText] = useState("");
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversation = useSetRecoilState(conversationsAtom);
    const imageRef = useRef(null);
    const { onClose } = useDisclosure();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText && !imgUrl) return;
        if (isSending) return;

        setIsSending(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                    img: imgUrl,
                }),
            })
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            setMessageText("");
            setImgUrl("");
            // add new data[message] to old messages array
            setMessages((messages) => [...messages, data]);

            // lastMessage added in the conversation block
            setConversation(prevConvs => {
                const updatedConversation = prevConvs.map(conversation => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender
                            }
                        }
                    }
                    return conversation;
                })
                return updatedConversation;
            })

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Flex gap={2} alignItems={"center"} w="full">
            <form onSubmit={handleSendMessage} style={{ flex: 5 }}>
                <InputGroup>
                    <Input
                        w={"full"}
                        placeholder="Type a message"
                        onChange={(e) => setMessageText(e.target.value)}
                        value={messageText}
                    />
                    <InputRightElement>
                        <BsFillImageFill
                            size={20}
                            style={{ cursor: "pointer" }}
                            onClick={() => imageRef.current.click()}
                        />
                        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                    </InputRightElement>
                </InputGroup>
            </form>

            {/* Send icon */}
            <Flex onClick={handleSendMessage} ml={2}>
                <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
            </Flex>

            {/* <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent w="50vw" h="50vh">
                <Image src={imgSrc} w=" 100%" h="100%" objectFit="contain" />
            </ModalContent>
        </Modal> */}

            {/* Image Preview */}
            <Modal
                isOpen={imgUrl}
                onClose={() => {
                    onClose();
                    setImgUrl("");
                }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={0} border={"5px solid"}>
                        <Image src={imgUrl} w={"100%"} h={"100%"} objectFit={"contain"} />
                        <ModalCloseButton
                            position={"absolute"}
                            top={"5px"}
                            right={"5px"}
                            style={{ cursor: "pointer" }}
                        />
                        <Flex
                            position={"absolute"}
                            bottom={"20px"}
                            right={"20px"}
                            style={{ cursor: "pointer" }}
                            onClick={handleSendMessage}
                        >

                            {!isSending ? (
                                <IoSendSharp size={30} />
                            ) : (
                                <Spinner size={"md"} />
                            )}
                        </Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    )
}
export default MessageInput
import { AddIcon } from "@chakra-ui/icons"
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState('');
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const [loading, setLoading] = useState(false);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();


    const handleTextChange = (e) => {
        const inputText = e.target.value;

        //if no. of characters exceeds 'MAX_CHAR'
        if (inputText.length > MAX_CHAR){
            // show only the first 'MAX_CHAR' no. of characters
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch("api/posts/create",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl })
            });
    
            const data = await res.json();
            if(data.error){
                showToast("Error", data.error, "error");
                return;
            }
    
            showToast("Success", "Post created successfully", "success");
            onClose();
            setPostText("");
            setImgUrl("");
            
        } catch (error) {
            showToast("Error", error, "error");
        } finally{
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={10}
                leftIcon={<AddIcon />}
                bg={useColorModeValue("grey.300", "gray.dark")}
                onClick={onOpen}
            >
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            {/* Description of the post */}
                            <Textarea
                                placeholder="Caption..."
                                onChange={handleTextChange}
                                value={postText}
                            />

                            {/* Count no. of characters */}
                            <Text fontSize='xs' textAlign={"right"} m={"1"} color={"gray.500"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={handleImageChange}
                            />

                            {/* Image icon */}
                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={20}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {/* Image preview */}
                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt="Selected img" borderRadius="md" />
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl("")
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button bg={'green.400'} _hover={{bg: 'green.600'}} mr={3} 
                            onClick={handleCreatePost}
                            isLoading={loading}
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost
import { Avatar, Box, Button, Divider, Flex, Image, Text, useToast } from "@chakra-ui/react"
import { FaRegBookmark } from "react-icons/fa";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  const toast = useToast();

  const postSave = () => {
    // show a pop-up message
    toast({
      description: "Saved post.",
      status: 'success',
      duration: 3000,
      isClosable: true,
  });  
  };

  return (
    <>
      <Flex my={5}>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          {/* ProfilePic */}
          <Avatar src="/avatar.jpg" size={"md"} name="Snehashis Dasgupta" />
          <Flex>
            {/* username */}
            <Text fontSize={"sm"} fontWeight={"bold"}>
              dasguptasnehashis
            </Text>
            {/* BlueTick */}
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
          <FaRegBookmark cursor={"pointer"} onClick={() => { postSave(); }} />
        </Flex>
      </Flex>


      <Text py={1} my={2} fontSize={"sm"}>postTitle</Text>
      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
        <Image src="/post0.jpg" w={"full"} />
      </Box>

      {/* Action icons */}
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      {/* Replies and likes */}
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          34 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {65 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>

      {/* A thin line to divide the post from comment section */}
      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Add a comment</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      {/* A thin line to divide the post from comment section */}
      <Divider my={4} />

      <Comment
        userAvatar="https://bit.ly/dan-abramov"
        username="choudhurysayan"
        comment="Looks really good..."
        createdAt="1d"
        likes = {22}
      />

      <Comment
        userAvatar="https://bit.ly/code-beast"
        username="ghoshsanket"
        comment="Consistency is the key."
        createdAt="2d"
        likes = {5}
      />

    </>
  )
}

export default PostPage
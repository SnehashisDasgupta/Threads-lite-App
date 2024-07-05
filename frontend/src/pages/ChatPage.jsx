import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import Conversation from "../components/Conversation"
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";

const ChatPage = () => {
  const showToast = useShowToast();
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation,setSelectedConversation] = useRecoilState(selectedConversationAtom);

  useEffect(() => {
    const getConversations = async () => {
      setSelectedConversation(
        {
          _id: "", 
          userId: "", 
          username: "", 
          userProfilePic: "", 
        }
      )
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setConversations(data);

      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        // show Skeleton loader for 3 seconds
        setTimeout(() => {
          setLoadingConversation(false);
        }, 2000);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px"
      }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row"
        }}
        maxW={{
          sm: "400px",
          md: "full"
        }}
        mx={"auto"}
      >
        
        <Flex flex={35} gap={2} flexDirection={"column"}
          w={{
            base: "90%", // Full width on modile
          }}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <form>
            <Flex alignItems={"center"} gap={2} mb={2}>

              <Input placeholder="Search for a user" />
              <Button size={"sm"}>
                <SearchIcon />
              </Button>

            </Flex>
          </form>

          {/* Loader Skeleton */}
          {loadingConversation &&
            conversations.map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))
          }

          {!loadingConversation && (
            conversations.map((conversation) => (
              <Conversation key={conversation._id} conversation={conversation} />
            ))
          )}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={65}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
            display={{ base: "none", md: "flex" }} // Hide on mobile, show on larger screens
          >
            {!selectedConversation._id && (
              <>
                <GiConversation size={100} />
                <Text fontSize={20}>Select a conversation to start messaging</Text>
              </>
            )}

            {selectedConversation._id && <MessageContainer />}
          </Flex>
        )}

        {selectedConversation._id && (
          <MessageContainer w={{ base: "100%", md: "full" }} display={{ base: "block", md: "none" }} />
        )}

      </Flex>
    </Box>
  )
}

export default ChatPage
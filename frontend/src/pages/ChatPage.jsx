import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import Conversation from "../components/Conversation"
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchConversation, setSearchConversation] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const { onlineUsers } = useSocket();

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
  }, [showToast, setConversations, setSelectedConversation]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      const res = await fetch(`/api/users/profile/${searchConversation}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      // if user is trying to message themselves
      if (searchedUser._id === currentUser._id) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      // If currentUser is already in a conversation with the searchedUser
      const conversationAlreadyExists = conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id);

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);

    } catch (error) {
      showToast("Error", "Enter some values", "error");
    } finally {
      setSearchingUser(false);
    }
  }

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

          {/* SEARCH CONVERSATION */}
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2} mb={2}>

              <Input placeholder="Search for a user"
                onChange={(e) => setSearchConversation(e.target.value)}
              />
              <Button size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>

            </Flex>
          </form>


          {/* Loader Skeleton for CONVERSATION */}
          {loadingConversation &&
            [...Array(5)].map((_, i) => (
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
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}
              />
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
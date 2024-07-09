import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useRef, useState } from "react";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const lastMessageRef = useRef(null);

  // socket- real-time message and lastMessage in conversation
  useEffect(() => {
    const handleNewMessage = (message) => {

      if (selectedConversation._id === message.conversationId) {
        // adding new message in prevMessages array
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      // update lastMessage for both the users in real-time
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      })
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    }
  }, [socket, selectedConversation._id, setConversations]);

  // Mark messages as seen and handle real-time seen updates
  useEffect(() => {
    const markMessagesAsSeen = () => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender !== currentUser._id) {
        socket.emit("markMessagesAsSeen", {
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId
        });
      }
    };
    // Mark messages as seen when the selected conversation changes
    if (selectedConversation && messages.length > 0) {
      markMessagesAsSeen();
    }


    const handleMessagesSeen = ({ conversationId }) => {
      /// Update seen status of messages when messagesSeen event is triggered
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => prev.map((message) => ({
          ...message,
          seen: true
        })));
      }
    };
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("messagesSeen", handleMessagesSeen);
    };

  }, [socket, currentUser._id, messages, selectedConversation]);

  // Smooth scrolling automatically when open a conversation
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        // if searchedUser is not in your conversation list then return without error
        if (selectedConversation.mock) return;

        const res = await fetch(`/api/messages/${selectedConversation.userId}`)
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);

      } catch (error) {
        showToast("Error", error.message, "error");
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock])

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}
        cursor={"pointer"}
        // when click 'Avatar' it will navigate to the profilePage
        onClick={() => navigate(`/${selectedConversation.username}`)}
      >

        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />

        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

      </Flex>

      <Divider />


      <Flex flexDir={"column"} gap={4} my={4} p={2} height={"480px"} overflowY={"auto"}>
        {/* Skeleton Loader */}
        {loadingMessages &&
          [...Array(10)].map((_, i) => (
            <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2} >
                <Skeleton h={"55px"} w={"250px"} />
              </Flex>

              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        }

        {!loadingMessages && (
          messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
              <Flex key={message._id}
                direction={"column"}
                ref={isLastMessage ? lastMessageRef : null} //used to scroll to the last message automatically
              >
                <Message message={message} ownMessage={currentUser._id === message.sender} />
              </Flex>
            );
          })
        )}

      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer
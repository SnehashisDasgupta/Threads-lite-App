import { atom } from "recoil";

export const conversationsAtom = atom({
  key: "conversationsAtom",
  default: [],
});


export const selectedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "", // conversation id
    userId: "", // selected conversation's userId
    username: "", //selected conversation's username
    userProfilePic: "", //selected conversation's profilePic
  }
});
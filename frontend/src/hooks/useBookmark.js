import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useBookmark = (postId) => {
  const currentUser = useRecoilValue(userAtom);
  const bookmarkKey = `isBookmarked-${postId}-${currentUser?._id}`;
  const showToast = useShowToast();

  const [isBookmarked, setIsBookmarked] = useState(() => {
    return JSON.parse(localStorage.getItem(bookmarkKey)) || false;
  });

  // if isBookmarked is false, remove it from localStorage
  const toggleBookmark = () => {
    if (!currentUser) return showToast("Error", "You must be logged in to bookmark a post", "error");

    if (isBookmarked) {
      localStorage.removeItem(bookmarkKey);
      setIsBookmarked(false);
    } else {
      localStorage.setItem(bookmarkKey, JSON.stringify(true));
      setIsBookmarked(true);
    }
  };

  return [isBookmarked, toggleBookmark];
};

export default useBookmark;

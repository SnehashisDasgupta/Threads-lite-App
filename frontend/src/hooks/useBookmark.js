import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const useBookmark = (postId) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const currentUser = useRecoilValue(userAtom); // logged in user

   // Retrieve bookmark state from local storage when the hook mounts
  useEffect(() => {
    const savedBookmarkState = localStorage.getItem(`isBookmarked-${postId}-${currentUser?._id}`);
    if (savedBookmarkState !== null) {
        setIsBookmarked(JSON.parse(savedBookmarkState));
    }
  }, [postId, currentUser]);

  // Function to handle bookmark click
  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(`isBookmarked-${postId}-${currentUser?._id}`, JSON.stringify(newBookmarkState));
  };

  return [isBookmarked, toggleBookmark];
};

export default useBookmark
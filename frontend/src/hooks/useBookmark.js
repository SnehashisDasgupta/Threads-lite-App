import { useEffect, useState } from "react";

const useBookmark = (postId) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

   // Retrieve bookmark state from local storage when the hook mounts
  useEffect(() => {
    const savedBookmarkState = localStorage.getItem(`isBookmarked-${postId}`);
    if (savedBookmarkState !== null) {
        setIsBookmarked(JSON.parse(savedBookmarkState));
    }
  }, [postId]);

  // Function to handle bookmark click
  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(`isBookmarked-${postId}`, JSON.stringify(newBookmarkState));
  };

  return [isBookmarked, toggleBookmark];
};

export default useBookmark
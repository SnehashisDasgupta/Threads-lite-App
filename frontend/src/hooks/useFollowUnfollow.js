import { useRecoilValue } from "recoil";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useState } from "react";

const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user.followers?.includes(currentUser?._id)); //default state: if the currentUser id present in followers array of user
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    //if not logged in
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    if (updating) return;

    setUpdating(true);

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `Unfollowed ${user.username}`, "success");
        user.followers.pop(); // remove user._id from followers_array of the user and decrement followers count
      } else {
        showToast("Success", `Followed ${user.username}`, "success");
        user.followers.push(currentUser?._id); //push user.id of currentUser._id in followers_array and increment followers count
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;

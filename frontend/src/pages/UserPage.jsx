import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const { loader } = useGetLoader();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const { username } = useParams();

  // useEffect triggers when username changes
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);

      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (!user && loader) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size='xl' />
      </Flex>
    )
  }
  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />

      {loader && [...Array(2)].map((_, idx) => <Loader key={idx} />)}
      {!loader && (
        <>
          <UserPost likes={23} replies={4} postImg="/post0.jpg" postTitle="Cycling is my passion🚴‍♀️🚴‍♂️🚴‍♀️" />
          <UserPost likes={34} replies={12} postImg="/post1.jpg" postTitle="Comics is the reason of my life👽🤖" />
          <UserPost likes={101} replies={44} postTitle="Money can't buy happiness, but it can make you happy💰💸💰" />
          <UserPost likes={54} replies={33} postImg="/post2.jpg" postTitle="Never think I am weak cause I am alone #lonewolf" />
        </>
      )}
    </>
  );
};

export default UserPage
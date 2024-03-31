import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import Loader from "../components/loader/Loader";
import useGetLoader from "../hooks/useGetLoader";

const UserPage = () => {
  const { loader } = useGetLoader();
  return (
    <>
      <UserHeader />

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
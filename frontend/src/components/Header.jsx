import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react"
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { BsFillChatQuoteFill } from "react-icons/bs";
import useLogout from "../hooks/useLogout";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {user ? (
        <Image
          cursor={"pointer"}
          alt="logo"
          w={8}
          // if mode is dark, logo will be light_mode and vice-versa
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
      ) : (
        <Image
          cursor={"pointer"}
          alt="logo"
          mx={"auto"}
          w={8}
          // if mode is dark, logo will be light_mode and vice-versa
          src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />
      )}

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>

          {/* LOGOUT */}
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default Header
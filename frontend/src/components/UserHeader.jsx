import { Avatar, Box, Button, Flex, Image, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react"
import { BsBookmarksFill, BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FaLink } from "react-icons/fa";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

// { user } -> user's profile
const UserHeader = ({ user }) => {
    const toast = useToast();
    const currentUser = useRecoilValue(userAtom); // logged in user
    const navigate = useNavigate();
    const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

    //Profile URL copied in the clipboard
    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            // show a pop-up message
            toast({
                title: 'Account created.',
                description: "Profile link copied.",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        });
    };

    return (
        <VStack spacing={4} alignItems='start'>
            <Flex justifyContent={'space-between'} w={'full'}>
                <Box>
                    {/* NAME */}
                    <Text fontSize={{
                        base: "md",
                        md: "xl",
                        'lg': "2xl",
                    }} fontWeight={'bold'}>{user.name}</Text>

                    {/* USERNAME */}
                    <Flex gap={1} alignItems={"center"}>
                        <Text fontSize={{
                            base: "xs",
                            md: "sm",
                            'lg': "md"
                        }}>
                            {user.username}
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />


                        {/* thread.net */}
                        <Text fontSize={"xs"} bg={'gray.dark'} color={"gray.light"} p={1} borderRadius={'full'}>
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {/* if profilePic is set then show otherwise not */}
                    {user.profilePic && (
                        <Avatar
                            name={user.name}
                            src={user.profilePic}
                            size={{
                                // profilePic changes size with screen ratio
                                base: "lg",
                                md: "xl",
                            }
                            } />
                    )}
                    {!user.profilePic && (
                        <Avatar
                            name={user.name}
                            src='https://bit.ly/broken-link'
                            size={{
                                base: "lg",
                                md: "xl",
                            }
                            } />
                    )}
                </Box>
            </Flex>

            <Text>{user.bio}</Text>

            {/* if current user is watching his own profile when update_profile button will show */}
            {currentUser?._id === user._id && (
                //as={RouterLink} to="/update" :The page will not get refresh when the updatePage will shown
                <Link as={RouterLink} to="/update">
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )}

            {/* if currentUser is watching other user's profile then follow button will show */}
            {currentUser?._id !== user._id && (
                <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                    {following ? "Unfollow" : "Follow"}
                </Button>
            )}

            <Flex w={'full'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'}>{user.followers.length} followers</Text>
                    <Box w={'1'} h={'1'} bg={'gray.light'} borderRadius={'full'}></Box>
                    <Link color={'gray.light'}>instagram.com</Link>
                </Flex>

                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={'pointer'} />
                    </Box>
                    {/* ThreeDot icon for coping the profile link */}
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={25} cursor={'pointer'} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"}
                                        onClick={copyURL}>
                                        <Box as="span" mr={2}>
                                            <FaLink />
                                        </Box>
                                        Copy link
                                    </MenuItem>

                                    {/* currentUser can only see BookmarkPage from his/her userProfile page */}
                                    {currentUser?._id === user?._id && (
                                        <MenuItem bg={"gray.dark"}
                                            onClick={() => navigate('/bookmarks')}>
                                            <Box as="span" mr={2}>
                                                <BsBookmarksFill />
                                            </Box>
                                            Bookmarks
                                        </MenuItem>
                                    )}
                                </MenuList>

                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>

            {/* Navigation menu for threads and replies */}
            <Flex w={'full'}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>
                    <Text fontWeight={"bold"}> Threads </Text>
                </Flex>
                <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb={"3"} cursor={"pointer"}>
                    <Text fontWeight={"bold"}> Replies </Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader;
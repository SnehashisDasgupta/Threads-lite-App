import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast";
import SuggestedUser from "./SuggestedUser";


const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/suggested");
                const data = await res.json();
                if (data.error) return showToast("Error", data.error, "error");

                setSuggestedUsers(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        }

        getSuggestedUsers();
    }, [showToast])

    return (
        <>
            <Text mb={4} fontWeight={"bold"}>
                Suggested Users
            </Text>

            <Flex direction={"column"} gap={4}>
                {!loading && suggestedUsers.map((user) =>
                    <SuggestedUser key={user._id} user={user} />
                )}
                

                {loading && suggestedUsers.map((__, idx) => (
                    <Flex key={idx} gap={2} alignItems={"center"} borderRadius={"md"}>
                        {/* Avatar skeleton */}
                        <Box>
                            <SkeletonCircle size={"10"} />
                        </Box>
                        {/* username & fullname skeleton */}
                        <Flex w={"full"} flexDirection={"column"} gap={2}>
                            <Skeleton h={"8px"} w={"70px"} />
                            <Skeleton h={"8px"} w={"90px"} />
                        </Flex>

                        {/* follow button skeleton */}
                        <Flex>
                            <Skeleton h={"20px"} w={"60px"} />
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </>
    )
}

export default SuggestedUsers

// Loading skeleton for suggested users

// < Flex direction = { "column"} gap = { 4} >
//     { loading && [...Array(5)].map((__, idx) => (
//         <Flex key={idx} gap={2} alignItems={"center"} borderRadius={"md"}>
//             {/* Avatar skeleton */}
//             <Box>
//                 <SkeletonCircle size={"10"} />
//             </Box>
//             {/* username & fullname skeleton */}
//             <Flex w={"full"} flexDirection={"column"} gap={2}>
//                 <Skeleton h={"8px"} w={"70px"} />
//                 <Skeleton h={"8px"} w={"90px"} />
//             </Flex>

//             {/* follow button skeleton */}
//             <Flex>
//                 <Skeleton h={"20px"} w={"60px"} />
//             </Flex>
//         </Flex>
//     ))}

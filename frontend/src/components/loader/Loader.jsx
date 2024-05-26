import { Avatar, Flex, Skeleton } from "@chakra-ui/react";

const ThreadSkeleton = () => {
  return (

    <Flex gap={3} mb={4} py={5} w={"full"}>

      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex alignItems={"center"} w={"full"} mb={4}>

          {/* admin user profilePic Skeleton */}
          <Avatar size={"md"} />
          {/* username Skeleton */}
          <Skeleton ml="2" h="5" w={"160px"} borderRadius={6} />

        </Flex>

        {/* Post Title */}
        <Skeleton h="8" mb="2" borderRadius={6} />

        {/* Post Image Skeleton */}
        <Skeleton mb="2" h="300px" w={"full"} borderRadius={6} />

        {/* Action icons skeletons
        <Flex justifyContent="space-between" alignItems="center" mb="2">
          <Skeleton h="6" w="30%" />
        </Flex> */}

        {/* Comment section Skeleton */}
        <Skeleton h="12" mb="2" borderRadius={6} />

      </Flex>
    </Flex>
  );
};

export default ThreadSkeleton;

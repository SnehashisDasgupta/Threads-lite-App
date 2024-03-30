import { Box, Flex, Skeleton } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Box maxW="600px" mx="auto" p="4">
      {/* Header */}
      <Flex alignItems="center" mb="4">
        <Skeleton mr="2" circle size="10" />
      </Flex>
      {/* Post */}
      <Flex alignItems="center" mb="4">
        <Skeleton mr="4" circle size="10" />
        <Skeleton flex="1" h="10" />
      </Flex>
      {/* Post Image */}
      <Skeleton mb="4" h="300px" />
      {/* Post Actions */}
      <Flex alignItems="center" mb="4">
        <Skeleton mr="2" circle size="6" />
        <Skeleton mr="2" circle size="6" />
        <Skeleton mr="2" circle size="6" />
      </Flex>
      {/* Likes and Comments */}
      <Flex alignItems="center">
        <Skeleton mr="2" h="6" w="24" />
        {/* <Skeleton mr="2" h="6" w="24" /> */}
      </Flex>
    </Box>
  );
};

export default Loader;

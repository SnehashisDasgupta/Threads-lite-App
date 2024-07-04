import { Avatar, Flex, Text } from "@chakra-ui/react"

const Message = ({ ownMessage }) => {
    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-end"}>
                    <Text maxW={"350px"} bg={"red.700"} color={"white"} p={1} borderRadius={"md"}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, repudiandae!
                    </Text>
                    <Avatar src="" w={7} h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src="" w={7} h={7} />

                    <Text maxW={"350px"} bg={"gray.600"} color={"white"} p={1} borderRadius={"md"}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius nulla minima vitae repellat in odio?
                    </Text>
                </Flex>
            )}
        </>
    )
}

export default Message
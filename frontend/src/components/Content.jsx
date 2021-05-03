import LeftBar from "./LeftBar";
import PageContent from "./PageContent";
import { Box, Flex, Center, Text } from "@chakra-ui/react";

const Content = (props) => {
  const { sidebar } = props.children;

  return (
    <Flex pt="5">
      <Box minW="20vw" maxW="20vw" m="8">
          <LeftBar />
      </Box>
      {sidebar}
      <Box w="60vw" h="100vh">
        <PageContent />
      </Box>

      <Center w="20vw">
        <Text>Box 1</Text>
      </Center>
    </Flex>
  );
};
export default Content;

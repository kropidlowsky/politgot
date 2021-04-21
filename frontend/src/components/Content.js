import LeftBar from './LeftBar'
import PageContent from './PageContent'
import PoliticianDrawer from './PoliticianDrawer'
import {
        Box,
        Flex,
        Center,
        Text,
        Skeleton
      } from '@chakra-ui/react'


const Content = (props) => {

  const { sidebar } = props.children;

  return (
    <Flex h="100%" pt={25} maxH="100vh">

      <Box w="20vw" maxH="100vh">
        <PoliticianDrawer />
        <Skeleton maxH="100vh" isLoaded><LeftBar /></Skeleton>
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
}
export default Content;
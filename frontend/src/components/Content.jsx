import LeftBar from "./LeftBar";
import PageContent from "./PageContent";
import PoliticianContent from "./PoliticianContent";
import { Box, Flex, Center, useColorModeValue, useBreakpointValue, Spacer } from "@chakra-ui/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./Main";
import PoliticianListDrawer from './PoliticianListDrawer'
import Trends from "./Trends";
import Copyright from "./Copyright";

const routes = [
  { path: "/", exact: true, pageContent: () => <Main /> },
  {
    path: "/politicians/:tweeters",
    exact: true,
    pageContent: () => <PoliticianContent />,
  },
  { path: "/politicians", exact: true, pageContent: () => <Main /> },
  {
    path: "/politicians/s=:search",
    exact: true,
    pageContent: () => <PageContent />,
  },
];

const Content = (props) => {
  const { sidebar } = props.children;

  return (
    <Flex pt="5" >
      <Box minW={useBreakpointValue({xl: "27vw", xs:"0" })} pt="100" ml="15" position="fixed">
        {useBreakpointValue({xl: <LeftBar />, xs:<PoliticianListDrawer /> })}
        
        
      </Box>
      <Spacer />
      {sidebar}
      <Box w="43vw" my="100" pb="10" borderRadius="15" bg={useColorModeValue("blackAlpha.50", "#2D3748")}>
        {/* <PageContent /> */}
        <Router>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.pageContent}
            />
          ))}
        </Router>
      </Box>
      <Spacer />
      <Box maxH="90vh" mt="100" w="20vw" ml="10" borderRadius="15" p="8" right="20" bg={useColorModeValue("blackAlpha.50", "#2D3748")} position="fixed">
        <Trends />
        <Copyright />
      </Box>

    </Flex>
  );
};
export default Content;

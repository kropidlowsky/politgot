import LeftBar from "./LeftBar";
import {
  Box,
  Flex,
  useColorModeValue,
  useBreakpointValue,
  Spacer,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./Main";
import PoliticianListDrawer from "./PoliticianListDrawer";
import Trends from "./Trends";
import Copyright from "./Copyright";
import PartiesList from "./PartiesList";

const routes = [
  { path: "/", exact: true, pageContent: () => <Main source="latest" /> },
  {
    path: "/politicians/tweety/s=:search",
    exact: true,
    pageContent: () => <Main source="search" />,
  },
  {
    path: "/politicians",
    exact: true,
    pageContent: () => <Main source="latest" />,
  },
  {
    path: "/politicians/:tweeters",
    exact: true,
    pageContent: () => <Main source="politic" />,
  },
  {
    path: "/parties",
    exact: true,
    pageContent: () => <Main source="latest" />,
  },
  {
    path: "/parties/:tweeters",
    exact: true,
    pageContent: () => <Main source="party" />,
  },
];

const Content = (props) => {
  const { sidebar } = props.children;

  return (
    <Flex pt="5">
      <Box
        minW={useBreakpointValue({ xl: "27vw", xs: "0" })}
        pt="100"
        ml="15"
        position="fixed"
      >
        {useBreakpointValue({ xl: <LeftBar />, sm: <PoliticianListDrawer />})}
      </Box>
      {useBreakpointValue({ xl: <Spacer />})}
      
      {sidebar}
      <Box
        wminW={useBreakpointValue({ xl: "43vw", xs: "80vw" })}
        p="8"
        my="100"
        pb="10"
        borderRadius="15"
        bg={useColorModeValue("blackAlpha.50", "#2D3748")}
      >
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
      {useBreakpointValue({ xl: <Spacer />})}
      <Box
        maxH="90vh"
        mt="100"
        w="20vw"
        ml="10"
        borderRadius="15"
        p="8"
        right="20"
        bg={useColorModeValue("blackAlpha.50", "#2D3748")}
        position="fixed"
      >
        <Trends />
        <Copyright />
      </Box>
    </Flex>
  );
};
export default Content;

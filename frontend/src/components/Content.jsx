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
import MainPoliticInfo from "./MainPoliticInfo";
import MainPartyInfo from "./MainPartyInfo";
import Polls from "./Polls";
import Speeches from "./Speeches";

const routes = [
  { path: "/", exact: true, pageContent: () => <Main source="latest" /> },
  {
    path: "/politicians/tweety/s=:search",
    exact: true,
    pageContent: () => <Main source="search" />,
  },
  {
    path: "/politicians/speaches/s=:search",
    exact: true,
    pageContent: () => <Main source="speaches" />,
  },
  {
    path: "/politicians/politic/:tweeters",
    exact: true,
    pageContent: () => <Main source="politic" />,
  },
  {
    path: "/politicians/speach/:tweeters",
    exact: true,
    pageContent: () => <Main source="speach" />,
  },
  {
    path: "/politicians/poll/:tweeters",
    exact: true,
    pageContent: () => <Main source="poll" />,
  },
  {
    path: "/politicians",
    exact: true,
    pageContent: () => <Main source="latest" />,
  },
  {
    path: "/politicians/:tweeters",
    exact: true,
    pageContent: () => <MainPoliticInfo />,
  },
  {
    path: "/parties",
    exact: true,
    pageContent: () => <Main source="parties" />,
  },
  {
    path: "/parties/tweets/:tweeters",
    exact: true,
    pageContent: () => <Main source="party" />,
  },
  {
    path: "/parties/:tweeters",
    exact: true,
    pageContent: () => <MainPartyInfo />,
  },
  {
    path: "/polls",
    exact: true,
    pageContent: () => <Polls></Polls>,
  },
  {
    path: "/speeches",
    exact: true,
    pageContent: () => <Speeches />,
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
        {useBreakpointValue({ xl: <LeftBar />, lg: <LeftBar />, sm: <PoliticianListDrawer /> })}
      </Box>
      {useBreakpointValue({ xl: <Spacer />, lg: <Spacer />})}

      {sidebar}
      <Box
        w={useBreakpointValue({ xl: "48vw", lg: "60vw", xs: "80vw" })}
        
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
      {useBreakpointValue({ xl: <Spacer /> })}
      {useBreakpointValue({ xl: <Box
        maxH="90vh"
        mt="100"
        w="20vw"
        ml="5"
        borderRadius="15"
        p="5"
        right="10"
        bg={useColorModeValue("blackAlpha.50", "#2D3748")}
        position="fixed"
      >
        <Trends />
        <Copyright />
      </Box> })}
    </Flex>
  );
};
export default Content;

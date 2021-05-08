import LeftBar from "./LeftBar";
import PageContent from "./PageContent";
import PoliticianContent from "./PoliticianContent";
import { Box, Flex, Center, Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Route } from "react-router-dom";

const routes = [
  { path: "/", exact: true, pageContent: () => <PageContent /> },
  {
    path: "/politicians/:tweeters",
    exact: true,
    pageContent: () => <PoliticianContent />,
  },
  { path: "/politicians", exact: true, pageContent: () => <PageContent /> },
];

const Content = (props) => {
  const { sidebar } = props.children;

  return (
    <Flex pt="5" >
      <Box minW="30vw">
        <LeftBar />
      </Box>
      {sidebar}
      <Box w="60vw">
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

      <Center w="20vw">
        
      </Center>
    </Flex>
  );
};
export default Content;

import { Container, List, ListItem, Text } from "@chakra-ui/layout";
import representatives from "../jsons/politycy.json";
import { useColorModeValue } from "@chakra-ui/react";

interface PoliticiansConfig {
  name?: string;
  register?: string;
}

const PoliticianItem = ({ name, register }: PoliticiansConfig) => {
  return (
    <ListItem
      bg={useColorModeValue("gray.50", "blackAlpha.300")}
      p="3"
      m="3"
      borderRadius="8"
      _hover={{ bg: useColorModeValue("red", "blue") }}
      justifyContent="center"
      shadowBox="Inner"
    >
      <Text>{name}</Text> <br />
      <Text>{register}</Text>
    </ListItem>
  );
};

const Politicians = () => {
  return (
    <Container h="100vh">
      <List maxH="80vh" mt="2em">
        {representatives.map((representatives) => (
          <PoliticianItem {...representatives} />
        ))}
      </List>
    </Container>
  );
};
export default Politicians;

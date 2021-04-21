import { List, ListItem, Text } from "@chakra-ui/layout";
import representatives from "../jsons/politycy.json";
import { useColorModeValue } from "@chakra-ui/react";

interface PoliticiansConfig {
  name?: string;
  register?: string;
}

const PoliticianItem = ({ name, register }: PoliticiansConfig) => {
  return (
    <ListItem
      bg={useColorModeValue("white", "blackAlpha.300")}
      p="3"
      m="3"
      borderRadius="8"
      _hover={{ bg: useColorModeValue("red", "blue") }}
      justifyContent="center"
    >
      <Text>{name}</Text> <br />
      <Text>{register}</Text>
    </ListItem>
  );
};

const Politicians = () => {
  return (
    <List maxH="80vh" mt="2em">
      {representatives.map((representatives) => (
        <PoliticianItem {...representatives} />
      ))}
    </List>
  );
};
export default Politicians;

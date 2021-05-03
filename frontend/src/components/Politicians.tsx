import { Link, Text, Wrap } from "@chakra-ui/layout";
import representatives from "../jsons/politycy.json";
import { useColorModeValue } from "@chakra-ui/react";

interface PoliticiansConfig {
  name?: string;
  register?: string;
}

const PoliticianItem = ({ name, register }: PoliticiansConfig) => {
  return (
    <Link
      bg={useColorModeValue("white", "#3F444E")}
      w="md"
      borderRadius="10"
      boxShadow="md"
      p="5"
      m="10"
      align="center"
      _hover={{
        bg: useColorModeValue("cyan.200", "cyan.600"),
        color: useColorModeValue("black", "white"),
      }}
      href="#"
    >
      <Text fontWeight="bold">{name}</Text> <br />
      <Text>{register}</Text>
    </Link>
  );
};

const Politicians = () => {
  return (
    <Wrap mt="5em" maxW="30vw" maxH="100vh">
      {representatives.map((representatives) => (
        <PoliticianItem {...representatives} />
      ))}
    </Wrap>
  );
};
export default Politicians;

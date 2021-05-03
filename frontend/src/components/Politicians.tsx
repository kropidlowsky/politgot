import { Container, List, ListItem, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface PoliticiansConfig {
  name?: string;
  surname?: string;
}

interface Politician {
  name: string;
  surname: string;
}

interface ResData {
  result: Politician[];
}

const PoliticianItem = ({ name, surname }: PoliticiansConfig) => {
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
      <Text>{surname}</Text>
    </ListItem>
  );
};

const Politicians = () => {
  const [data, setData] = useState<Politician[]>([]);

  const fetchData = () => {
    axios
      .get<ResData>("http://127.0.0.1:5000/polit")
      .then(function (response) {
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container h="100vh">
      <List maxH="80vh" mt="2em">
        {data.map((data) => (
          <PoliticianItem {...data} />
        ))}
      </List>
    </Container>
  );
};
export default Politicians;

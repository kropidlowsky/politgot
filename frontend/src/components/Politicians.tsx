import { Link, Text, Wrap } from "@chakra-ui/layout";
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
    <Link
      bg={useColorModeValue("white", "blackAlpha.200")}
      w="95%"
      p="2"
      borderRadius="10"
      boxShadow="md"
      align="center"
      _hover={{
        bg: useColorModeValue("red.500", "red.500"),
        color: useColorModeValue("white", "white"),
      }}
      href={"/politicians/" + name + "_" + surname}
    >
      <Text fontWeight="400" fontSize="lg">
        {name} {surname}
      </Text>
    </Link>
  );
};

// const username = "admin";
// const password = "secret";
// const token = `${username}:${password}`;
// const encodedToken = Buffer.from(token).toString("base64");

const Politicians = () => {
  const [data, setData] = useState<Politician[]>([]);

  const fetchData = () => {
    axios
      .get<ResData>("https://politgot-umk.herokuapp.com/polit")
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
    <Wrap
      bg={useColorModeValue("blackAlpha.50", "#2D3748")}
      borderRadius="15"
      ml="10"
      maxH="85vh"
      maxW="md"
      mt="100"
      overflowY="auto"
      overflowX="hidden"
      position="fixed"
      pl="1rem"
      py="5"
    >
      {data.map((data, index) => (
        <PoliticianItem key={index} {...data} />
      ))}
    </Wrap>
  );
};
export default Politicians;

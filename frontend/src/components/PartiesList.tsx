import { Link, Text, Wrap } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface PoliticiansConfig {
  name?: string;
  twitter_name?: string;
}

interface Politician {
  name: string;
  twitter_name: string;
}

interface ResData {
  result: Politician[];
}

const PoliticianItem = ({ name, twitter_name }: PoliticiansConfig) => {
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
      href={"/parties/" + name}
    >
      <Text fontWeight="400" fontSize="lg">
        {name}
      </Text>
    </Link>
  );
};

// const username = "admin";
// const password = "secret";
// const token = `${username}:${password}`;
// const encodedToken = Buffer.from(token).toString("base64");

const PartiesList = () => {
  const [data, setData] = useState<Politician[]>([]);

  const fetchData = () => {
    axios
      .get<ResData>(
        "https://politgot-umk.herokuapp.com/polit_party_twitter_acc",
        {
          auth: {
            username: "admin",
            password: "secret",
          },
        }
      )
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
      maxH="90vh"
      maxW="sm"
      overflowY="auto"
      overflowX="hidden"
      p="3"
    >
      {data.map((data, index) => (
        <PoliticianItem key={index} {...data} />
      ))}
    </Wrap>
  );
};
export default PartiesList;

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
  let link = "/politicians/" + name + "_" + surname;
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
      href={link}
    >
      <Text fontWeight="bold">{name}</Text> <br />
      <Text>{surname}</Text>
    </Link>
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
    <Wrap mt="5em" maxW="30vw" maxH="100vh">
      {data.map((data, index) => (
        <PoliticianItem key={index} {...data} />
      ))}
    </Wrap>
  );
};
export default Politicians;

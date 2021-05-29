import {
  Center,
  Text,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface SpeechesData {
  date: string;
  speech: string;
  speech_point: string;

  name: string;
  surname: string;

  index: number;
}

function SpeechesDraw({
  date,
  speech,
  speech_point,
  name,
  surname,
  index,
}: SpeechesData) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        maxW={"99%"}
        direction={{ base: "column-reverse", md: "row" }}
        width={"full"}
        rounded={"3xl"}
        p={10}
        m="0 auto"
        justifyContent={"space-between"}
        position={"relative"}
        bg={useColorModeValue("white", "blackAlpha.200")}
        _after={{
          message: '""',
          position: "absolute",
          height: "21px",
          width: "29px",
          left: "35px",
          top: "-10px",
        }}
      >
        <SimpleGrid columns={1} spacing={4}>
          <Box>
            <chakra.p fontWeight={"bold"} fontSize={"xl"} pb={4}>
              {name + " " + surname}
            </chakra.p>
            <chakra.p fontWeight={"semibold"} fontSize={"sm"} pb={4}>
              {speech_point}
              <chakra.span fontWeight={"thin"} fontSize={"12px"}>
                {" - " + date.replace("00:00:00 GMT", "")}
              </chakra.span>
            </chakra.p>
            <chakra.p fontWeight={"medium"} fontSize={"16px"} pb={4}>
              {speech}
            </chakra.p>
          </Box>
        </SimpleGrid>
      </Flex>
    </Skeleton>
  );
}

interface ResData {
  result: SpeechesData[];
  error: string;
  offset: number;
  limit: number;
}

export default function Speeches() {
  const [data, setData] = useState<SpeechesData[]>([]);

  useEffect(() => {
    axios
      .get<ResData>("https://politgot-umk.herokuapp.com/latest_speeches", {
        auth: {
          username: "admin",
          password: "secret",
        },
      })
      .then(function (response) {
        //temporary fix for errors 1
        console.log(response.data.error);
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, []);

  return (
    <Flex
      textAlign={"center"}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
    >
      <SimpleGrid columns={{ base: 1, xl: 1 }} spacing={"20"}>
        <Center>
          <Text fontSize="4xl" fontWeight="bold">
            {"Ostatnie przemowy sejmowe"}
          </Text>
        </Center>
        {data?.map((pollsData, index) => (
          <SpeechesDraw key={index} {...pollsData} index={index} />
        ))}
      </SimpleGrid>
      <Box></Box>
    </Flex>
  );
}

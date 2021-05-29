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

interface PollsData {
  abstained_vote: number;
  against_vote: number;
  all_votes: number;
  for_vote: number;
  politic_vote: string;
  title: string;
  date: string;
  index: number;
}

function PollsDraw({
  title,
  date,
  politic_vote,
  for_vote,
  abstained_vote,
  against_vote,
  all_votes,
  index,
}: PollsData) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        w={"80%"}
        direction={{ base: "column-reverse", md: "row" }}
        width={"full"}
        rounded={"3xl"}
        p={8}
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
          <Box bg="blackAlpha.50" p="4" borderRadius="xl">
            <chakra.p
              fontWeight={"normal"}
              fontStyle="normal"
              fontSize={"lg"}
              pb={4}
            >
              {title}{" "}
              <chakra.span
                fontWeight={"light"}
                fontStyle="italic"
                fontSize={"xs"}
              >
                {" - " + date.replace("00:00:00 GMT", "")}
              </chakra.span>
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"normal"} fontSize={"xl"}>
              {"Wszystkich głosów: " + all_votes}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"normal"} fontSize={"xl"}>
              {" Głosów za: " + for_vote}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"normal"} fontSize={"xl"}>
              {" Głosów przeciw: " + against_vote}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"normal"} fontSize={"xl"}>
              {" Głosów wstrzymanych: " + abstained_vote}
            </chakra.p>
          </Box>
        </SimpleGrid>

        {/* <chakra.span>{date}</chakra.span> */}
      </Flex>
    </Skeleton>
  );
}
interface ResData {
  result: PollsData[];
  error: string;
  offset: number;
  limit: number;
}

export default function Polls() {
  const [data, setData] = useState<PollsData[]>([]);

  useEffect(() => {
    axios
      .get<ResData>("https://politgot-umk.herokuapp.com/latest_pools", {
        auth: {
          username: "admin",
          password: "secret",
        },
      })
      .then(function (response) {
        //temporary fix for errors
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
            {"Ostatnie głosowania"}
          </Text>
        </Center>
        {data?.map((pollsData, index) => (
          <PollsDraw key={index} {...pollsData} index={index} />
        ))}
      </SimpleGrid>
      <Box></Box>
    </Flex>
  );
}

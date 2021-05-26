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
  date: Date;
  for_vote: number;
  politic_vote: string;
  title: string;
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
        maxW={"46vw"}
        direction={{ base: "column-reverse", md: "row" }}
        width={"full"}
        rounded={"3xl"}
        p={10}
        m="5"
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
            <chakra.p fontWeight={"medium"} fontSize={"20px"} pb={4}>
              {title}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"bold"} fontSize={"16px"}>
              {"Głos: " + politic_vote}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"bold"} fontSize={"16px"}>
              {"Wszystkich głosów: " + all_votes}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"bold"} fontSize={"16px"}>
              {" Głosów za: " + for_vote}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"bold"} fontSize={"16px"}>
              {" Głosów przeciw: " + against_vote}
            </chakra.p>
          </Box>
          <Box>
            <chakra.p fontWeight={"bold"} fontSize={"16px"}>
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
      .get<ResData>("http://politgot-umk.herokuapp.com/latest_pools", {
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
      pt={10}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
    >
      <SimpleGrid
        columns={{ base: 1, xl: 1 }}
        spacing={"20"}
        mt={16}
        mx={"auto"}
      >
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

import axios from "axios";
import { useEffect, useState } from "react";

import {
  Link,
  Stack,
  Button,
  SimpleGrid,
  // Avatar,
  // Box,
  chakra,
  Flex,
  // SimpleGrid,
  useColorModeValue,
  Skeleton,
  Center,
  Box,
  // useBreakpointValue,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

interface Tweets {
  date: string;
  message: string;
  name: string;
  index: number;
}

function PartyTweets({ name, message, date, index }: Tweets) {
  return (
    <Skeleton isLoaded>
      <Center>
        <Flex
          boxShadow={"md"}
          maxW={"40vw"}
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
          <Flex
            direction={"column"}
            textAlign={"left"}
            justifyContent={"space-between"}
          >
            <chakra.p fontWeight={"medium"} fontSize={"20px"} pb={4}>
              {message}
            </chakra.p>
            <chakra.p fontWeight={"bold"} fontSize={14}>
              {name + "  "}
              <chakra.span fontWeight={"medium"} color={"gray.500"}>
                {" "}
                - {date}
              </chakra.span>
            </chakra.p>
          </Flex>
        </Flex>
      </Center>
    </Skeleton>
  );
}

interface PartyData {
  name: string;
  short_name: string;
  tweets: Tweets[];
  wiki_summary: string;
  error: string;
}

export default function MainPartyInfo() {
  const [data, setPartyData] = useState<PartyData>();
  let { tweeters } = useParams<{ tweeters: string }>();

  useEffect(() => {
    axios
      .get<PartyData>(
        "http://politgot-umk.herokuapp.com/party_main_info?politic_party=" +
          tweeters,
        {
          auth: {
            username: "admin",
            password: "secret",
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
        setPartyData(response.data);
      })
      .catch(function (error: any) {
        console.log(error);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <Skeleton isLoaded>
      <SimpleGrid
        // maxW={""}
        columns={1}
        minW={"50vw"}
        spacing={5}
        bg={"blackAlpha.50"}
        p="1"
        borderRadius="15"
      >
        <Box>
          <br></br>
          <Center>
            <chakra.p fontWeight={"bold"} fontSize={"4xl"} my="5">
              {data?.name + "  "}
            </chakra.p>
          </Center>

          <br></br>
          <br></br>
          <Center>
            <Stack direction="row" spacing={4} align="center">
              <Link href={"/parties/tweets/" + data?.name}>
                <Button colorScheme="teal" variant="outline">
                  Tweety
                </Button>
              </Link>
            </Stack>
          </Center>
        </Box>

        <Box>
          <chakra.p fontSize="2xl" fontWeight="500">
            <Center>Wikipedia</Center>
          </chakra.p>
        </Box>
        <Box>
          <Flex
            boxShadow={"md"}
            maxW={"45vw"}
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
            <chakra.p fontSize="lg" fontWeight="500">
              {data?.wiki_summary}
            </chakra.p>
          </Flex>
        </Box>
      </SimpleGrid>

      <Box>
        <Center>
          <chakra.p fontSize="3xl" fontWeight="800" pt="10">
            {"Ostatnie Tweety:"}
          </chakra.p>
        </Center>{" "}
        {data?.tweets.slice(0, 5).map((tweetData, index) => (
          <PartyTweets key={index} {...tweetData} index={index} />
        ))}
      </Box>
    </Skeleton>
  );
}

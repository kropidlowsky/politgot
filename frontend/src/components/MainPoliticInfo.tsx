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

interface PoliticTweet {
  date: Date;
  message: string;
  name: string;
  surname: string;
  tags: string;
  url_photo: string;
  url_tweet: string;
  url_video: string;
  index: number;
}

function Tweets({ name, surname, message, date, index }: PoliticTweet) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        maxW={"23vw"}
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
            {surname || " "}
            <chakra.span fontWeight={"medium"} color={"gray.500"}>
              {" "}
              - {date}
            </chakra.span>
          </chakra.p>
        </Flex>
      </Flex>
    </Skeleton>
  );
}

interface Polls {
  abstained_vote: number;
  against_vote: number;
  all_votes: number;
  date: string;
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
}: Polls) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        maxW={"23vw"}
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
              <chakra.span fontWeight={"semibold"} fontSize={"15px"}>
                {" - " + date.replace("00:00:00 GMT", "")}
              </chakra.span>
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

interface Speeches {
  date: Date;
  speech: string;
  speech_point: string;
}

interface PoliticInfo {
  birth_date: string;
  birth_place: string;
  education: string;
  gender: string;
  name: string;
  surname: string;
  polls: Polls[];
  profile_image: string;
  tweets: PoliticTweet[];
  error: string;

  profession: string;
  speeches: Speeches[];
  votes: number;
  wiki_summary: string;

  index: number;
}

export default function MainPoliticInfo() {
  const [data, setData] = useState<PoliticInfo>();
  let { tweeters } = useParams<{ tweeters: string }>();

  useEffect(() => {
    axios
      .get<PoliticInfo>(
        "https://politgot-umk.herokuapp.com/main_politic_info?politic=" +
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
        setData(response.data);
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
        columns={2}
        spacing={5}
        bg={"blackAlpha.50"}
        p="1"
        borderRadius="15"
      >
        <Box>
          <Center>
            <chakra.p fontWeight={"bold"} fontSize={"4xl"} my="5">
              {data?.name + "  "}
              {data?.surname || " "}
            </chakra.p>
          </Center>
          <Center>
            <chakra.p fontWeight={"bold"} fontSize={"lg"}>
              {"Zawód: " + data?.profession || " "}
            </chakra.p>
          </Center>
          <Center>
            <chakra.p fontWeight={"bold"} fontSize={"lg"}>
              {"Data urodzenia: " +
                (data?.birth_date || " ").replace("00:00:00 GMT", "")}
            </chakra.p>
          </Center>
          <Center>
            <chakra.p fontWeight={"500"} fontSize={"lg"}>
              {" Miejsce urodzenia: " + (data?.birth_place || " ") + " "}
            </chakra.p>
          </Center>
          <Center>
            <chakra.p fontSize="lg" fontWeight="500">
              {"Wykształcenie: " + (data?.education || " ")}
            </chakra.p>
          </Center>
          <br></br>
          <br></br>
          <br></br>
          <Center>
            <Stack direction="row" spacing={4} align="center">
              <Link
                href={
                  "/politicians/politic/" + data?.name + "_" + data?.surname
                }
              >
                <Button colorScheme="teal" variant="outline">
                  Tweety
                </Button>
              </Link>
              <Link
                href={"/politicians/speach/" + data?.name + "_" + data?.surname}
              >
                <Button colorScheme="teal" variant="outline">
                  Wypowiedzi sejmowe
                </Button>
              </Link>
              <Link
                href={"/politicians/poll/" + data?.name + "_" + data?.surname}
              >
                <Button colorScheme="teal" variant="outline">
                  Głosowania
                </Button>
              </Link>
            </Stack>
          </Center>
        </Box>

        <Box>
          <Box>
            <chakra.p fontSize="2xl" fontWeight="500">
              <Center>Wikipedia</Center>
            </chakra.p>
          </Box>
          <Flex
            boxShadow={"md"}
            maxW={"24vw"}
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

      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Center>
            <chakra.p fontSize="3xl" fontWeight="800" pt="10">
              {"Ostatnie Tweety:"}
            </chakra.p>
          </Center>{" "}
          {data?.tweets.length ? (
            data?.tweets
              .slice(0, 5)
              .map((tweetData, index) => (
                <Tweets key={index} {...tweetData} index={index} />
              ))
          ) : (
            <Center>
              <chakra.p fontWeight={"bold"} fontSize={"20px"}>
                {"Brak danych"}
              </chakra.p>
            </Center>
          )}
        </Box>
        <Box>
          <Center>
            <chakra.p fontSize="3xl" fontWeight="800" pt="10">
              {"Ostatnie głosowania:"}
            </chakra.p>
          </Center>{" "}
          {data?.polls.length ? (
            data?.polls
              .slice(0, 5)
              .map((pollsData, index) => (
                <PollsDraw key={index} {...pollsData} index={index} />
              ))
          ) : (
            <Center>
              <chakra.p fontWeight={"bold"} fontSize={"20px"}>
                {"Brak danych"}
              </chakra.p>
            </Center>
          )}
        </Box>
      </SimpleGrid>
    </Skeleton>
  );
}

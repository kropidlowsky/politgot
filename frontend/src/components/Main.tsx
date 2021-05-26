import {
  // Avatar,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PoliticianListDrawer from "./PoliticianListDrawer";

interface TestimonialCardProps {
  name: string;
  surname: string;
  role: string;
  message: string;
  speech: string;
  profile_image: string;
  index: number;
  date: Date;
  error: string;
}

function TestmonialCard({
  name,
  surname,
  role,
  message,
  speech,
  profile_image,
  date,
  error,
}: TestimonialCardProps) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        maxW={"640px"}
        direction={{ base: "column-reverse", md: "row" }}
        width={"full"}
        rounded={"3xl"}
        p={10}
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
          <chakra.p fontWeight={"medium"} fontSize={"15px"} pb={4}>
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
        {/* <Avatar
          src={"data:image/png;base64, " + profile_image}
          height={"80px"}
          width={"80px"}
          alignSelf={"center"}
          m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
        /> */}
      </Flex>
    </Skeleton>
  );
}

interface Speeches {
  date: string;
  speech: string;
  speech_point: string;
  index: number;
}

function SpeechesDraw({ date, speech, speech_point, index }: Speeches) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        maxW={"26vw"}
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
            <chakra.p fontWeight={"medium"} fontSize={"16px"} pb={4}>
              {speech}
            </chakra.p>
            <chakra.p fontWeight={"bold"} fontSize={"13px"} pb={4}>
              {speech_point}
              <chakra.span fontWeight={"thin"} fontSize={"12px"}>
                {" - " + date.replace("00:00:00 GMT", "")}
              </chakra.span>
            </chakra.p>
          </Box>
        </SimpleGrid>
      </Flex>
    </Skeleton>
  );
}

interface Polls {
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
}: Polls) {
  return (
    <Skeleton isLoaded>
      <Flex
        boxShadow={"md"}
        maxW={"26vw"}
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
  result: TestimonialCardProps[];
  polls: Polls[];
  speeches: Speeches[];
  error: string;
}

interface Props {
  source: string;
}
const Main = (props: Props) => {
  const [data, setData] = useState<TestimonialCardProps[]>([]);
  const [pollsData, setPollsData] = useState<Polls[]>([]);
  const [speechData, setSpeechData] = useState<Speeches[]>([]);

  const { search } = useParams<{ search: string }>();
  let { tweeters } = useParams<{ tweeters: string }>();
  const [polls, setPolls] = useState(false);
  const [speeches, setSpeeches] = useState(false);

  useEffect(() => {
    let link = "";
    if (props.source === "latest") {
      link = "https://politgot-umk.herokuapp.com/latest";
    }
    if (props.source === "parties") {
      link = "https://politgot-umk.herokuapp.com/latest?specify=politic_party";
    }
    if (props.source === "search")
      link = "https://politgot-umk.herokuapp.com/find_tweet?text=" + search;
    if (props.source === "speaches")
      link = "https://politgot-umk.herokuapp.com/find_speech?text=" + search;
    if (props.source === "politic")
      link = "https://politgot-umk.herokuapp.com/tweets?politic=" + tweeters;
    if (props.source === "speach") {
      link =
        "https://politgot-umk.herokuapp.com/main_politic_info?politic=" +
        tweeters;
      setSpeeches(true);
    }
    if (props.source === "poll") {
      link =
        "https://politgot-umk.herokuapp.com/main_politic_info?politic=" +
        tweeters;
      setPolls(true);
    }
    if (props.source === "party") {
      link =
        "https://politgot-umk.herokuapp.com/parties_tweets?politic_party=" +
        tweeters;
      link = link.replace(/\s+/g, "_");
    }
    axios
      .get<ResData>(link, {
        auth: {
          username: "admin",
          password: "secret",
        },
      })
      .then(function (response) {
        //temporary fix for errors
        console.log(response.data);

        props.source === "poll"
          ? console.log(response.data.error)
          : props.source === "speach"
          ? console.log(response.data.error)
          : console.log(response.data.result[0].error);

        setPollsData(response.data.polls);

        setSpeechData(response.data.speeches);
        setData(response.data.result);
      })
      .catch(function (error: unknown) {
        console.log(error);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      textAlign={"center"}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
    >
      {useBreakpointValue({
        xs: <PoliticianListDrawer />,
        sm: <PoliticianListDrawer />,
      })}
      <SimpleGrid columns={{ base: 1, xl: 1 }} spacing={"6"} mx={"auto"}>
        <Text fontSize="4xl" fontWeight="bold">
          {props.source === "search"
            ? "Szukaj: " + search
            : props.source === "politic"
            ? "Wpisy " + tweeters.replace("_", " ")
            : props.source === "latest"
            ? "Najnowsze wpisy"
            : props.source === "party"
            ? "Najnowsze wpisy"
            : ""}
        </Text>
        <Text fontSize={"30px"} fontWeight={"bold"}>
          {polls
            ? "Głosowania w sejmie " + tweeters.replace("_", " ")
            : speeches
            ? "Wypowiedzi w sejmie " + tweeters.replace("_", " ")
            : " "}
        </Text>
        {polls
          ? pollsData?.map((pollsData, index) => (
              <PollsDraw key={index} {...pollsData} index={index} />
            ))
          : speeches
          ? speechData?.map((speechData, index) => (
              <SpeechesDraw key={index} {...speechData} index={index} />
            ))
          : data?.map((cardInfo, index) => (
              <TestmonialCard key={index} {...cardInfo} index={index} />
            )) || "Brak danych"}
      </SimpleGrid>
      <Box></Box>
    </Flex>
  );
};

export default Main;

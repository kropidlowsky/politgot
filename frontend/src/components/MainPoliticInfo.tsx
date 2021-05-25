import axios from "axios";
import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
  useBreakpointValue,
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
  abstained_vote,
  against_vote,
  all_votes,
  index,
}: Polls) {
  return (
    <Skeleton isLoaded>
      <Flex>
        <chakra.p>{title}</chakra.p>
        <chakra.span>{date}</chakra.span>
        <chakra.p>{"Głos: " + politic_vote}</chakra.p>
        <chakra.p>
          {"Wszystkich głosów: " +
            all_votes +
            " Głosów za: " +
            against_vote +
            " Wstrzymało się od głosu: " +
            abstained_vote}
        </chakra.p>
      </Flex>
    </Skeleton>
  );
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
  index: number;
}

interface ResData {
  result: PoliticInfo[];
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
  }, []);

  return (
    <div>
      <Skeleton isLoaded>
        <Avatar
          size="2xl"
          src={"data:image/png;base64, " + data?.profile_image}
        />
        <chakra.p fontWeight={"bold"} fontSize={14}>
          {data?.name + "  "}
          {data?.surname || " "}
        </chakra.p>
        <chakra.p fontWeight={"bold"} fontSize={14}>
          {" Urodzony: " + data?.birth_place}
          {data?.birth_date}
        </chakra.p>
        <chakra.p>{"Wykształcenie: " + data?.education}</chakra.p>
        <table>
          <tr>
            <td>
              {"Tweety:"}
              <br></br>
              {data?.tweets.map((tweetData, index) => (
                <Tweets key={index} {...tweetData} index={index} />
              ))}
            </td>
            <td>
              {data?.polls.map((pollsData, index) => (
                <PollsDraw key={index} {...pollsData} index={index} />
              ))}
            </td>
          </tr>
        </table>
      </Skeleton>
    </div>
  );
}

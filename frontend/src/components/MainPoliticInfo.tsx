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
}

interface Polls {
  abstained_vote: number;
  against_vote: number;
  all_votes: number;
  date: Date;
  for_vote: number;
  politic_vote: string;
  title: string;
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

function Profile({
  birth_date,
  birth_place,
  education,
  gender,
  name,
  surname,
  polls,
  profile_image,
  tweets,
  error,
}: PoliticInfo) {
  return (
    <Skeleton isLoaded>
      <Avatar size="2xl" src={"data:image/png;base64, " + profile_image} />
      <chakra.p fontWeight={"bold"} fontSize={14}>
        {name + "  "}
        {surname || " "}
      </chakra.p>
      <chakra.p fontWeight={"bold"} fontSize={14}>
        {" Urodzony: " + birth_place}
        {birth_date}
      </chakra.p>
      <chakra.p>{"Wykształcenie: " + education}</chakra.p>
    </Skeleton>
  );
}

export default function MainPoliticInfo() {
  const [data, setData] = useState<PoliticInfo[]>([]);
  let { tweeters } = useParams<{ tweeters: string }>();

  useEffect(() => {
    axios
      .get<ResData>(
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
        console.log(response.data.result[0].error);
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {/* {data.map((cardInfo, index) => (
        <Profile key={index} {...cardInfo} index={index} />
      ))} */}
      {data}
    </div>
  );
}

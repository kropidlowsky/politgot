import {
  Avatar,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface TestimonialCardProps {
  name: string;
  surname: string;
  role: string;
  message: string;
  avatar: string;
  index: number;
  date: Date;
  error: string;
}

function TestmonialCard({
  name,
  surname,
  role,
  message,
  avatar,
  date,
  error,
}: TestimonialCardProps) {
  const { tweeters } = useParams<{ tweeters: string }>();
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
            {tweeters}
            <chakra.span fontWeight={"medium"} color={"gray.500"}>
              {" "}
              - {date}
            </chakra.span>
          </chakra.p>
        </Flex>
        <Avatar
          src={avatar}
          height={"80px"}
          width={"80px"}
          alignSelf={"center"}
          m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
        />
      </Flex>
    </Skeleton>
  );
}

interface ResData {
  result: TestimonialCardProps[];
}

export default function GridBlurredBackdrop() {
  const { tweeters } = useParams<{ tweeters: string }>();

  const [data, setData] = useState<TestimonialCardProps[]>([]);

  useEffect(() => {
    axios
      .get<ResData>(
        "https://politgot-umk.herokuapp.com/tweets?politic=" + tweeters
      )
      .then(function (response) {
        //temporary fix for errors
        console.log(response.data.result[0].error);
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, [tweeters]);

  return (
    <Flex
      textAlign={"center"}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
    >
      <Text fontSize="3xl" pt="10">
        {tweeters}
      </Text>
      <SimpleGrid
        columns={{ base: 1, xl: 1 }}
        spacing={"10"}
        mt={16}
        mx={"auto"}
      >
        {data.map((cardInfo, index) => (
          <TestmonialCard key={index} {...cardInfo} index={index} />
        ))}
      </SimpleGrid>
      <Box pt="30"></Box>
    </Flex>
  );
}

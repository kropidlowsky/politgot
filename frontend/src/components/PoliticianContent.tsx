import {
  Avatar,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const testimonials = [
  {
    name: "Brandon P.",
    role: "Chief Marketing Officer",
    content:
      "It really saves me time and effort. It is exactly what our business has been lacking. EEZY is the most valuable business resource we have EVER purchased. After using EEZY my business skyrocketed!",
    avatar:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
  },
  {
    name: "Krysta B.",
    role: "Entrepreneur",
    content:
      "I didn't even need training. We've used EEZY for the last five years. I have gotten at least 50 times the value from EEZY. I made back the purchase price in just 48 hours!",
    avatar:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
  },
  {
    name: "Darcy L.",
    role: "Movie star",
    content:
      "Thank you for making it painless, pleasant and most of all, hassle free! I'm good to go. No matter where you go, EEZY is the coolest, most happening thing around! I love EEZY!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
  },
  {
    name: "Daniel T.",
    role: "Musician",
    content:
      "I am so pleased with this product. EEZY is both attractive and highly adaptable. Without EEZY, we would have gone bankrupt by now. Thank you for creating this product!",
    avatar:
      "https://images.unsplash.com/photo-1606513542745-97629752a13b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
  },
];

interface TestimonialCardProps {
  name: string;
  role: string;
  message: string;
  avatar: string;
  index: number;
  date: Date;
}

function TestmonialCard({
  name,
  role,
  message,
  avatar,
  date,
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
        bg={useColorModeValue("white", "#3F444E")}
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

interface Tweet {
  date: Date;
  message: string;
}

interface ResData {
  result: TestimonialCardProps[];
}

export default function GridBlurredBackdrop() {
  const { tweeters } = useParams<{ tweeters: string }>();

  const [data, setData] = useState<TestimonialCardProps[]>([]);

  const fetchData = () => {
    axios
      .get<ResData>("http://127.0.0.1:5000/tweets?politic=" + tweeters)
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
        {data.map((cardInfo, index) => (
          <TestmonialCard {...cardInfo} index={index} />
        ))}
      </SimpleGrid>
      <Box></Box>
    </Flex>
  );
}

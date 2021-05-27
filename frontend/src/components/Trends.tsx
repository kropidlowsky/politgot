import { Link, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Center, Wrap } from "@chakra-ui/layout";
import {} from "react-router-dom";

interface ITrends {
  is_politic_search: boolean;
  phrase: string;
  index: number;
}

interface IResult {
  result: ITrends[];
}

const Trend = ({ is_politic_search, phrase, index }: ITrends) => {
  return (
    <>
      <Link
        p={"0px"}
        fontSize={index < 12 ? 35 - index * 2 : 12}
        fontWeight={index % 2 ? "400" : "200"}
        href={"/politicians/tweety/s=" + phrase}
        _hover={{ color: "red.500" }}
      >
        {phrase}
      </Link>
    </>
  );
};

const Trends = () => {
  const [data, setData] = useState<ITrends[]>([]);

  useEffect(() => {
    axios
      .get<IResult>("https://politgot-umk.herokuapp.com/trends", {
        auth: {
          username: "admin",
          password: "secret",
        },
      })
      .then(function (response) {
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, []);
  return (
    <Wrap overflow="none">
      <Center
        fontSize={"3xl"}
        color={useColorModeValue("red.300", "red.500")}
        textShadow={useColorModeValue("1px 1px black", "1px 1px white")}
        fontWeight="700"
      >
        {"Najpopularniejsze"}
      </Center>
      {data.map((trends, index) => {
        return <Trend key={index} {...trends} index={index} />;
      })}
    </Wrap>
  );
};

export default Trends;

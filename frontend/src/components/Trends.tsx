import { Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Wrap } from "@chakra-ui/layout";
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
        fontSize={30 - (index % 10)}
        fontWeight={index % 3 ? "400" : "200"}
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
      .get<IResult>("https://politgot-umk.herokuapp.com/trends")
      .then(function (response) {
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, []);
  return (
    <Wrap overflow="none">
      {data.map((trends, index) => {
        return <Trend key={index} {...trends} index={index} />;
      })}
    </Wrap>
  );
};

export default Trends;

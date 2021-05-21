import axios from "axios";
import { useEffect, useState } from "react";

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

interface PoliticInfo {
  birth_date: string;
  birth_place: string;
  education: string;
  gender: string;
  name: string;
  surname: string;
  polls: number;
  profile_image: string;
  tweets: PoliticTweet[];
  error: string;
}

interface ResData {
  result: PoliticInfo[];
}

export default function MainPoliticInfo() {
  const [data, setData] = useState<PoliticInfo[]>([]);

  const username = "admin";
  const password = "secret";

  const token = Buffer.from(`${username}:${password}`, "utf8").toString(
    "base64"
  );

  useEffect(() => {
    axios
      .get<ResData>(
        "https://politgot-umk.herokuapp.com/main_politic_info?politic=Dominik_Tarczy%C5%84ski",
        {
          //   method: "GET",
          //   withCredentials: true,
          method: "GET",
          // mode: "no-cors",
          headers: {
            // "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Methods": "GET",
            // "Access-Control-Allow-Headers": "Content-Type,Accept",
            // Accept: "application/json",
            // "Content-Type": "application/json",
            // Authorization: `Basic ${token}`,

            Origin: "http://localhost:3000",
          },
          auth: {
            username: "admin",
            password: "secret",
          },
        }
      )
      .then(function (response) {
        //temporary fix for errors
        console.log(response.headers);
        console.log(response.data.result[0].error);
        setData(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, [token]);

  return <h1>siema{console.log(data)}</h1>;
}

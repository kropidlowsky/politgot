import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  HStack,
  IconButton,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

interface PoliticiansConfig {
  name?: string;
  surname?: string;
}

const PoliticianItem = ({ name, surname }: PoliticiansConfig) => {
  return (
    <Link
      bg={useColorModeValue("white", "blackAlpha.200")}
      pt="1"
      align="center"
      _hover={{
        bg: useColorModeValue("red.500", "red.500"),
        color: useColorModeValue("white", "white"),
      }}
      href={"/politicians/" + name + "_" + surname}
    >
      <Text
        bg={useColorModeValue("white", "blackAlpha.200")}
        w="95%"
        p="2"
        borderRadius="3"
        align="center"
        _hover={{
          bg: useColorModeValue("red.500", "red.500"),
          color: useColorModeValue("white", "white"),
        }}
        borderBottom="1px solid"
        color={useColorModeValue("blackAlpha.800", "white")}
      >
        {name} {surname}
      </Text>
    </Link>
  );
};

interface Politician {
  name: string;
  surname: string;
}

interface ResData {
  result: Politician[];
}

const SearchBar = () => {
  const [link, setLink] = useState("_");
  const [names, setNames] = useState<Politician[]>([]);
  const [filtered, setFiltered] = useState<Politician[]>([]);

  const fetchData = () => {
    axios
      .get<ResData>("https://politgot-umk.herokuapp.com/polit", {
        auth: {
          username: "admin",
          password: "secret",
        },
      })
      .then(function (response) {
        setNames(response.data.result);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filter = () => {
      setFiltered(
        names.filter((name) => {
          let query = link;
          query = query.toLowerCase();
          let both = name.name + " " + name.surname;

          return both.toLowerCase().indexOf(query) >= 0;
        })
      );
    };
    filter();
  }, [link, names]);

  const history = useHistory();

  const redirect = () => {
    history.push("/politicians/tweety/s=" + link + "?");
    history.go(0);
  };

  const initialFocusRef = useRef() as React.MutableRefObject<any>;

  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <form onSubmit={redirect}>
      <HStack>
        <Popover
          initialFocusRef={initialFocusRef}
          placement="bottom"
          returnFocusOnClose={false}
          closeOnBlur={false}
          isOpen={isOpen}
        >
          <PopoverTrigger>
            <Input
              type="text"
              w={useBreakpointValue({ xl: "10vw", xs: "90%" })}
              id="header-search"
              placeholder="Szukaj"
              onChange={(e) => {
                setLink(e.target.value);
              }}
              ref={initialFocusRef}
              autoComplete="off"
              onBlur={close}
              onFocus={open}
            />
          </PopoverTrigger>
          <PopoverContent color="black">
            <PopoverArrow />
            <PopoverBody>
              <div>
                <Link
                  pt="1"
                  align="center"
                  _hover={{
                    bg: useColorModeValue("red.500", "red.500"),
                    color: useColorModeValue("white", "white"),
                  }}
                  href={"/politicians/tweety/s=" + link}
                >
                  <Text
                    bg={useColorModeValue("red.400", "red.400")}
                    color={useColorModeValue("white", "white")}
                    fontWeight={"bold"}
                    w="95%"
                    p="2"
                    align="center"
                    _hover={{
                      bg: useColorModeValue("red.500", "red.500"),
                      color: useColorModeValue("white", "white"),
                    }}
                  >
                    {"Wyszukaj frazy w tweetach: '" + link + "'"}
                  </Text>
                </Link>

                <Link
                  bg={useColorModeValue("white", "blackAlpha.200")}
                  p="1 0 0 0"
                  align="center"
                  _hover={{
                    bg: useColorModeValue("red.500", "red.500"),
                    color: useColorModeValue("white", "white"),
                  }}
                  href={"/politicians/speaches/s=" + link}
                >
                  <Text
                    bg={useColorModeValue("blackAlpha.300", "blackAlpha.700")}
                    color={useColorModeValue("blackAlpha.800", "white")}
                    fontWeight={"bold"}
                    w="95%"
                    p="2"
                    align="center"
                    _hover={{
                      bg: useColorModeValue("blackAlpha.700", "red.500"),
                      color: useColorModeValue("white", "white"),
                    }}
                  >
                    {"Wyszukaj frazy w wypowiedziach: '" + link + "'"}
                  </Text>
                </Link>

                {filtered.map((filteredName, index) => (
                  <PoliticianItem key={index} {...filteredName} />
                ))}
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <IconButton
          aria-label="Search database"
          icon={<SearchIcon />}
          onClick={redirect}
        />
      </HStack>
    </form>
  );
};

export default SearchBar;

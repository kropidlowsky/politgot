import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
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
      .get<ResData>("https://politgot-umk.herokuapp.com/polit")
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
    setFiltered(
      names.filter((name) =>
      {
        let query = link;
        query = query.toLowerCase;
      
        return (
          name.name.toLowerCase().indexOf(query) >= 0 ||
          name.surname.toLowerCase().indexOf(query) >= 0 || 
        )
        .includes(link.toUpperCase)
      )
    );
    
    console.log(link);
  }, [link]);

  const history = useHistory();

  const redirect = () => {
    history.push("/politicians/tweety/s=" + link + "?");
    history.go(0);
  };

  const initialFocusRef = useRef() as React.MutableRefObject<any>;
  return (
    <form onSubmit={redirect}>
      <HStack>
        <Popover
          initialFocusRef={initialFocusRef}
          placement="bottom"
          closeOnBlur={false}
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
            />
          </PopoverTrigger>
          <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
            <PopoverArrow />
            <PopoverBody>
              <div>
                <li>{"Wyszukaj frazę: '" + link + "'"}</li>
                {filtered.map((filteredName, index) => (
                  <li key={index}>
                    {filteredName.name + filteredName.surname}
                  </li>
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

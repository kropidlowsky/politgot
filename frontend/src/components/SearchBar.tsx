import { useState } from "react";
import {
  FormLabel,
  HStack,
  IconButton,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  const [link, setLink] = useState("");

  const history = useHistory();

  const redirect = () => {
    history.push("/politicians/tweety/s=" + link + "?");
    history.go(0);
  };

  return (
    <form onSubmit={redirect}>
      <HStack>
        <Input
          type="text"
          w={useBreakpointValue({ xl: "10vw", xs: "90%" })}
          id="header-search"
          placeholder="Szukaj"
          onChange={(e) => setLink(e.target.value)}
        />
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

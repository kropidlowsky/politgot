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
    history.push("/politicians/s=" + link);
  };

  return (
    <form onSubmit={redirect}>
      <HStack>
        <FormLabel htmlFor="header-search" placeholder="Szukaj" />
        <Input
          type="text"
          w={useBreakpointValue({ xl: "10vw", xs: "89%" })}
          id="header-search"
          placeholder="Szukaj"
          name="s"
          onChange={(e) => setLink(e.target.value)}
        />
        <IconButton
          onClick={redirect}
          aria-label="Search database"
          icon={<SearchIcon />}
        />
      </HStack>
    </form>
  );
};

export default SearchBar;

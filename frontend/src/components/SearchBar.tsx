import { useState } from "react";
import { FormLabel, HStack, IconButton, Input } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  const [link, setLink] = useState("");

  const history = useHistory();

  const redirect = () => {
    history.push("/politicians/tweety/s=" + link);
  };

  return (
    <form>
      <HStack>
        <FormLabel htmlFor="header-search" placeholder="Szukaj" />
        <Input
          type="text"
          minW="10vw"
          maxW="10vw"
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

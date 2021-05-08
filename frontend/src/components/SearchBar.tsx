import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
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
      <label htmlFor="header-search">
        <span className="visually-hidden">Szukaj</span>
      </label>
      <input
        type="text"
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
    </form>
  );
};

export default SearchBar;

import { useState } from "react";
import { Link } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";

const SearchBar = () => {
  const [link, setLink] = useState("");

  const history = useHistory();

  const redirect = () => {
    history.push("/politicians/s=" + link);
  };

  return (
    <form onSubmit={redirect}>
      <label htmlFor="header-search">
        <span className="visually-hidden">Search blog posts</span>
      </label>
      <input
        type="text"
        id="header-search"
        placeholder="Search blog posts"
        name="s"
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={redirect}>Search</button>
    </form>
  );
};

export default SearchBar;

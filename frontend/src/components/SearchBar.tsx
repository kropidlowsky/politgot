import { useState } from "react";
import { Link } from "@chakra-ui/layout";

const SearchBar = () => {
  const [link, setLink] = useState("");

  return (
    <form action="/" method="get">
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
      <Link href={"/politicians/s=" + link}>Search</Link>
    </form>
  );
};

export default SearchBar;

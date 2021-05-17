import { useEffect, useState } from "react";

const PartiesList = () => {
  const [data, setData] = useState([""]);
  useEffect(() => {
    setData(["partie", "lista"]);
  }, [data]);
  return <h1>ListaParti</h1>;
};
export default PartiesList;

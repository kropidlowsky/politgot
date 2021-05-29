import { Route } from "react-router-dom";
import Politicians from "./components/Politicians";
import PoliticianContent from "./components/PoliticianContent";

const BaseRouter = () => (
  <div>
    <Route path="/:tweeters" children={PoliticianContent} />
    <Route path="/politicians" children={Politicians} />
  </div>
);

export default BaseRouter;

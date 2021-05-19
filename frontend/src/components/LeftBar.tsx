import Politicians from "./Politicians";
import PartiesList from "./PartiesList";

import { BrowserRouter as Router, Route } from "react-router-dom";

const routes = [
  { path: "/", exact: true, sidebar: () => <Politicians /> },
  {
    path: "/politicians/:tweeters",
    exact: true,
    sidebar: () => <Politicians />,
  },
  { path: "/politicians", sidebar: () => <Politicians /> },
  {
    path: "/parties",
    sidebar: () => <PartiesList />,
  },
];

const LeftBar = () => {
  return (
    <Router>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.sidebar}
        />
      ))}
    </Router>
  );
};

export default LeftBar;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PoliticianList from './PoliticianList'
import TwitterTweetsList from './TwitterTweetsList'


import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const routes = [
  { path: '/',
    exact: true,
    sidebar: () => <></>,
    
  },
  { path: '/politicians/:tweeters',
  exact: true,
    sidebar: () => <PoliticianList />,
    
  },
  { path: '/politicians',
  exact: true,
    sidebar: () => <PoliticianList />,
    
  }
]

const useStyles = makeStyles({
  root: {
    width: '30vw',
    height: '90vh'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const LeftBar = () => {
  const classes = useStyles();
  return <Router>
          {routes.map((route, index) => (
        // You can render a <Route> in as many places
        // as you want in your app. It will render along
        // with any other <Route>s that also match the URL.
        // So, a sidebar or breadcrumbs or anything else
        // that requires you to render multiple things
        // in multiple places at the same URL is nothing
        // more than multiple <Route>s.
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.sidebar}
        />
      ))
      }
</Router>
}

export default LeftBar;
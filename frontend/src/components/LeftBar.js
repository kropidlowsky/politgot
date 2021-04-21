import { makeStyles } from '@material-ui/core/styles';
import Politicians from './Politicians'


import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

const routes = [
  { path: '/',
    exact: true,
    sidebar: () => <></>,
    
  },
  { path: '/politicians/:tweeters',
  exact: true,
    sidebar: () => <Politicians />,
    
  },
  { path: '/politicians',
  exact: true,
    sidebar: () => <Politicians />,
    
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
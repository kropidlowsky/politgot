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

const LeftBar = () => {
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
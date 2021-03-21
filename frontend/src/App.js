import React, { useState } from 'react';
import { dark, light } from './theme';
import AppBar from './components/AppBar';
import {createMuiTheme, MuiThemeProvider, ThemeProvider} from '@material-ui/core/styles'
import Content from './components/Content'
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import { Switch } from '@material-ui/core';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Container from '@material-ui/core/Container'

function App() {
  const [theme, setTheme] = useState(true);
  const icon = !theme ? <WbSunnyIcon /> : <NightsStayIcon />
  const appliedTheme = createMuiTheme(theme ? light : dark)
  return (
    <ThemeProvider theme={appliedTheme}>     
          <Router>
            <div style={{backgroundColor: appliedTheme.palette.primary.secondary}}>
            <AppBar />
            <Content>
              <BaseRouter />
            </Content> 
            <Switch onClick={() => setTheme(!theme)} />
            </div>
            
          </Router>
            

    </ThemeProvider>
  );
}

export default App;
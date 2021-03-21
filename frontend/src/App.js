import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, MuiTheme, MuiThemeDark} from './theme';
import { GlobalStyles } from './global';
import Switch from '@material-ui/core/Switch';
import Drawer from './Drawer.js';
import AppBar from './components/AppBar';
import {MuiThemeProvider} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MainPage from './components/MainPage'
import LeftBar from './components/LeftBar';
import Content from './components/Content'

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }
  return (
    <MuiThemeProvider theme={theme === 'light' ? MuiTheme : MuiThemeDark}>

    
          <AppBar />
          <div>
            <Content />
          </div>
    </MuiThemeProvider>
  );
}

export default App;
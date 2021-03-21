import React, { useState } from 'react';
import { MuiTheme, MuiThemeDark} from './theme';
import AppBar from './components/AppBar';
import {MuiThemeProvider} from '@material-ui/core/styles'
import Content from './components/Content'
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';

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

    
          
          <Router>
            <AppBar />
            <Content>
              <BaseRouter />
            </Content> 
          </Router>
            

    </MuiThemeProvider>
  );
}

export default App;
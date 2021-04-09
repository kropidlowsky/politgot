import React, { useState } from 'react';
import { dark, light } from './theme';
import AppBar from './components/AppBar';
import {createMuiTheme, MuiThemeProvider, ThemeProvider} from '@material-ui/core/styles'
import Content from './components/Content'
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import {ChakraProvider} from "@chakra-ui/react";
import Navbar from './components/Navbar.tsx';


function App() {
  const [theme, setTheme] = useState(true);
  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Content>
          <BaseRouter />
        </Content> 
      </Router>
    </ChakraProvider>
  );
}

export default App;
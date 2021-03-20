import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { GlobalStyles } from './global';
import Switch from '@material-ui/core/Switch';
import Drawer from './Drawer.js'


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
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
          <Drawer />
          <footer>
            <Switch onClick={toggleTheme} inputProps={{ 'aria-label': 'primary checkbox' }} />
          </footer>
        </>
        
    </ThemeProvider>
  );
}

export default App;
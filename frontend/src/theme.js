import { createMuiTheme } from "@material-ui/core";

export const light = {
  palette: {
    type: 'light',
    primary: {
      main: '#FFF',
      secondary: '#e2e2e2',
    }
  },
}

export const dark = {
  palette: {
    type: 'dark',
    primary: {
      main: '#2e2e2e',
      secondary: '#3d3d3d',
    },
    secondary: {
      main: '#f00'
    },
    text: {
      primary: '#FFF',
    },
  }
}

export const lightTheme = createMuiTheme({
    body: '#e2e2e2',
    text: '#363537',
    toggleBorder: '#fff',
    gradient: 'linear-gradient(#39598A, #79D7ED)',
  })
  
  export const darkTheme = createMuiTheme({
    body: '#041333',
    text: '#FFFFFF',
    color: 'white',
    toggleBorder: '#6B8096',
    gradient: 'linear-gradient(#091236, #1E215D)',
  })
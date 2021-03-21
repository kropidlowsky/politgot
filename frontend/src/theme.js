import { createMuiTheme } from "@material-ui/core";

export const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
  background: '#000',
})

export const MuiThemeDark = createMuiTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  }
})

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
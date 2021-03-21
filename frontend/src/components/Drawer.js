import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import HomeSharpIcon from '@material-ui/icons/HomeSharp';
import ContactSupportSharpIcon from '@material-ui/icons/ContactSupportSharp';
import PersonPinCircleSharpIcon from '@material-ui/icons/PersonPinCircleSharp';
import SupervisedUserCircleSharpIcon from '@material-ui/icons/SupervisedUserCircleSharp';
import Logo from './Logo.js';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const useStyles = makeStyles({
  list: {
    width: 250,
    textAlign: 'center',
  },
  fullList: {
    width: 'auto',
    textAlign: 'center',
  },
  menuButton: {
    color: 'black',
    borderRadius: 0,
    fontSize: 'large',
  },

});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: true,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
        
      <List>
      <Logo />
        <ListItem button key="MainPage">
            <ListItemIcon><HomeSharpIcon fontSize="Large"/></ListItemIcon>
            <ListItemText primary="Strona Główna" />
        </ListItem>
        <ListItem button key="Politycy">
            <ListItemIcon><PersonPinCircleSharpIcon fontSize="Large"/></ListItemIcon>
            <ListItemText primary="Politycy"/>
        </ListItem>
        <ListItem button key="Partie">
            <ListItemIcon><SupervisedUserCircleSharpIcon fontSize="Large"/></ListItemIcon>
            <ListItemText primary="Partie"/>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="O nas">
                <ListItemIcon><ContactSupportSharpIcon fontSize="Large"/></ListItemIcon>
                <ListItemText primary="O nas"/>
        </ListItem>
      </List>
      <footer>
          <h6>PolitGot 2021</h6>
      </footer>
    </div>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton onClick={toggleDrawer(anchor, true)}><ArrowForwardIosIcon className={classes.menuButton}/></IconButton>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
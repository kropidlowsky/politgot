import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import { Divider } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  chipsContainer: {
      width: '80%',
      textAlign: 'center',
      padding: 20,

  }
}));

export default function Chips() {
  const classes = useStyles();

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <div className={classes.root}>
        <Typography variant="h6" component="h2" style={{width: '100%', textAlign: 'center'}}>
          Popularne
        </Typography>
            
            <Chip label="Aborcja" component="a" href="#chip" clickable />
            <Chip label="Donald Tusk" component="a" href="#chip" clickable />
            <Chip label="Trybunał Konstytucyjny" component="a" href="#chip" clickable />
            <Chip label="Strajk" component="a" href="#chip" clickable />
            <Chip label="Andrzej Duda" component="a" href="#chip" clickable />
            <Chip label="Trzaskowski" component="a" href="#chip" clickable />
            <Chip label="PiS" component="a" href="#chip" clickable />
            <Chip label="Lewica" component="a" href="#chip" clickable />
            <Chip label="Młoda Prawica" component="a" href="#chip" clickable />
            <Chip label="Marsz Niepodległości" component="a" href="#chip" clickable />
            <Chip label="Strajk Kobiet" component="a" href="#chip" clickable />
    </div>
  );
}
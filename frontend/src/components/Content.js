import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import MainPage from './MainPage'
import Chips from './Chips';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
    width: '100%',
  },
  mainBar: {
    height: '90vh',
    width: '50vw',
  },
  leftBar: {
    height: '90vh',
    width: '20vw',
  },
  rightBar: {
    height: '90vh',
    width: '20vw',
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const SpacingGrid = (props) => {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  const { main, sidebar } = props.children;

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={spacing}>
            <Grid item>
              <Paper className={classes.leftBar} >
                  {sidebar}
                </Paper>

            </Grid>
            <Grid item>
              <Paper className={classes.mainBar}>
                  <MainPage>
                    {main}
                  </MainPage>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.rightBar}>
                  <Chips />
              </Paper>
            </Grid>
          
        </Grid>
      </Grid>
    </Grid>
  );
}
export default SpacingGrid;
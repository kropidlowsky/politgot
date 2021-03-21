import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles({
  root: {
    width: 500,
    margin: 10,
    //background: '#f0f0f0'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard() {
  const classes = useStyles();

  return (
    <Grid
  container
  direction="column"
  justify="center"
  alignItems="center"
>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
            @AndrzejDuda
        </Typography>
        <Typography variant="h6" component="h2">
          Kancelaria Prezydenta
        </Typography>
        <Typography variant="body2" component="p">
        Z okazji Międzynarodowego Dnia Lasów Prezydent 
@AndrzejDuda
 sadząc drzewa w Leśnictwie Bączki (Nadleśnictwo Garwolin), zainaugurował ogólnopolską akcję „Łączą nas drzewa”.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Przejdź do Tweet'a</Button>
      </CardActions>
    </Card>
    </Grid>
  );
}

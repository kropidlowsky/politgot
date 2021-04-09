import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MainPage from './MainPage'
import Chips from './Chips';
import Hidden from '@material-ui/core/Hidden'
import LeftBar from './LeftBar'
import PageContent from './PageContent'
import {
        Box,
        Flex,
        Center,
        Text,
        Square,
        Container
      } from '@chakra-ui/react'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 5,
    width: '99%',
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

  const { sidebar } = props.children;

  return (
    <Flex h="100%">
  <Box w="20vw" h="100vh">
    <LeftBar />
  </Box>
  
  <Box w="60vw" h="100vh">
    <PageContent />
  </Box>
  <Center w="20vw">
    <Text>Box 1</Text>
  </Center>
</Flex>
  );
}
export default SpacingGrid;
import Content from './components/Content'
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';
import {ChakraProvider} from "@chakra-ui/react";
import Navbar from './components/Navbar.tsx';

function App() {
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
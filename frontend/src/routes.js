import { Route } from 'react-router-dom';
import TwitterAccPage from './components/TwitterAccPage';
import PoliticianDrawer from './components/PoliticianDrawer'

const BaseRouter = () => (
    <div>
        <Route exact path='/:tweeters' component={TwitterAccPage} />
        <Route path="/politicians" component={PoliticianDrawer}/>
    </div>
);

export default BaseRouter;
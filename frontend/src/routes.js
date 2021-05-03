import { Route } from 'react-router-dom';
import Politicians from './components/Politicians'

const BaseRouter = () => (
    <div>
        {/* <Route exact path='/:tweeters' component={TwitterAccPage} /> */}
        <Route path="/politicians" component={Politicians}/>
    </div>
);

export default BaseRouter;
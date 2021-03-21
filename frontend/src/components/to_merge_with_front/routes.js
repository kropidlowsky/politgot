import React from 'react';
import { Route } from 'react-router-dom';

import TwitterAccountList from './components/TwitterAccountList'
import TwitterAccPage from './components/TwitterAccPage';

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={TwitterAccountList} />
        <Route exact path='/:tweeters' component={TwitterAccPage} />

        
    </div>
);

export default BaseRouter;
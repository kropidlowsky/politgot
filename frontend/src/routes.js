import React from 'react';
import { Route } from 'react-router-dom';
import PoliticianList from './components/PoliticianList'
import TwitterAccountList from './components/TwitterAccountList'
import TwitterAccPage from './components/TwitterAccPage';
import TwitterTweetsList from './components/TwitterTweetsList'
import PoliticianDrawer from './components/PoliticianDrawer'

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={TwitterTweetsList} />
        <Route exact path='/:tweeters' component={TwitterAccPage} />
        <Route path="/politicians" component={PoliticianDrawer}/>
    </div>
);

export default BaseRouter;
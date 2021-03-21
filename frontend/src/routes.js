import React from 'react';
import { Route } from 'react-router-dom';
import PoliticianList from './components/PoliticianList'
import TwitterAccountList from './components/TwitterAccountList'
import TwitterAccPage from './components/TwitterAccPage';
import TwitterTweetsList from './components/TwitterTweetsList'

const BaseRouter = () => (
    <div>
        <Route exact path='/' component={PoliticianList} />
        <Route exact path='/:tweeters' component={TwitterAccPage} />
        <Route path="/politicians" components={{main: TwitterTweetsList, sidebar: PoliticianList}}/>
    </div>
);

export default BaseRouter;
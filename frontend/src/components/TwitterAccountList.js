import React from 'react';
import axios from 'axios';

import TwitterAccount from './TwitterAccount';

class TwitterAccountList extends React.Component {

    state = {
        tweetaccs: []
    }

    componentDidMount() {
        axios.get(`http://127.0.0.1:5000/polit_twitter_acc`)
            .then(res => {
                this.setState({
                    tweetaccs: res.data
                });
            })
    }

    render() {
        return (
            <TwitterAccount data={this.state.tweetaccs} />
        )
    }
}

export default TwitterAccountList;
import React from 'react';
import axios from 'axios';

class TwitterAccPage extends React.Component {
    state = {
        pageTweets: []
    }
    
    componentDidMount() {
        const pathname = window.location.pathname.substr(1,)
        axios.get('http://127.0.0.1:5000/tweets?politic=' + pathname)
            .then(res => {
                this.setState({
                    pageTweets: res.data
                });
            })
    }

    render() {
        return (
            
            <div>
                {/* <Tweets data={this.state.tweetaccs} /> */}
            </div>
        )
    }
  }

export default TwitterAccPage;
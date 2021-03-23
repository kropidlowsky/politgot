import React from 'react';
import axios from 'axios';
import data from '../jsons/politycy'

import Politician from './Politician';

class PoliticianList extends React.Component {

    state = {
        polits: []
    }

    componentDidMount() {
        // axios.get(`http://127.0.0.1:5000/polit`)
        //     .then(res => {
        //         this.setState({
        //             polits: res.data
        //         });
        //     })
        this.setState({
            polits: data
        })
    }

    render() {
        return (
            <Politician data={this.state.polits} />

        )
    }
}

export default PoliticianList;
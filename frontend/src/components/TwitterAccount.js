import React from 'react';
import {Link} from 'react-router-dom'
// zamien list na front ktory zrobiles
import { List } from 'antd';


const TwitterAccount = (props) => {
    return (
    <List
        itemLayout="vertical"
        size="large"
        pagination={{
        onChange: (page) => {
            console.log(page);
        },
        pageSize: 3,
        }}
        dataSource={props.data}
        renderItem={item => (
        <List.Item

            //nazwa twittera
            key={item.twitter_name}
            
            
        >
            <List.Item.Meta
            //imie i nazwisko
            title={item.surname + item.name}
            />
            <Link to={'/'+item.twitter_name}>{item.twitter_name}</Link>
        </List.Item>
        )}
    />
    )
}

export default TwitterAccount;
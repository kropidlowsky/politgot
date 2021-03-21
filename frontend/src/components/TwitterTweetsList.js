import React from 'react';
// zamien list na front ktory zrobiles
import { List } from 'antd';


const TwitterTweetsList = (props) => {
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
        >
            <List.Item.Meta
            
            //rzeczy ktore sa wyciagniete z bazy
            description={
                item.message +
                item.date +
                item.tags +
                item.ulr_photo +
                item.url_video +
                item.url_tweet
            }
            />
        </List.Item>
        )}
    />
    )
}

export default TwitterTweetsList;
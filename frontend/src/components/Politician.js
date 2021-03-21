import React from 'react';

// zamien list na front ktory zrobiles
import { List } from 'antd';


const Politician = (props) => {
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

            //imie i nazwisko
            key={item.surname + item.name}
            
            
        >
        </List.Item>
        )}
    />
    )
}

export default Politician;
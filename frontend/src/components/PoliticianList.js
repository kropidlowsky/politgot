import React from 'react';
import axios from 'axios';
import representatives from '../jsons/politycy'
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './politicianList.css';
import { List, message, Avatar, Spin } from 'antd';
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';
import Politician from './Politician';
import { ThemeProvider } from '@material-ui/styles';
import { useTheme } from '@material-ui/core';


class PoliticianList extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
      };
    
      componentDidMount() {
        // this.fetchData(res => {
          this.setState({
            data: representatives,
        //   });
        });

        
      }
    
    //   fetchData = callback => {
    //     reqwest({
    //       url: url,
    //       type: 'json',
    //       method: 'get',
    //       contentType: 'application/json',
    //       success: res => {
    //         callback(res);
    //       },
    //     });
    //   };
    
      handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
          loading: true,
        });
        if (data.length > 14) {
          message.warning('Infinite List loaded all');
          this.setState({
            hasMore: false,
            loading: false,
          });
          return;
        }
        this.fetchData(res => {
          data = data.concat(res.results);
          this.setState({
            data,
            loading: false,
          });
        });
      };
    

      render() {
        return (
          <div className="infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                
                dataSource={this.state.data}
                renderItem={item => (
                  <List.Item key={item.id} 
                             className="listItem">
                    <List.Item.Meta
                    //   avatar={
                    //     <Avatar src="" />
                    //   }
                      title={<a style={{color:'black'}} href="https://ant.design">{item.name}</a>}
                      description={item.register}
                    />
                    <div>.</div>
                  </List.Item>
                )}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className="load-container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        );
      }
}

export default PoliticianList;
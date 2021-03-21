import React from 'react'
import Tweet from 'react-tweet'

const tweetData = {
  id_str: 'XXX',
  user: {
    name: 'XXX',
    screen_name: 'XXX',
    profile_image_url: 'XXX'
  },
  text: 'XXX',
  created_at: 'XXX',
  favorite_count: 'XXX',
  retweet_count: 'XXX',
  entities: {
    media: [],
    urls: [],
    user_mentions: [],
    hashtags: [],
    symbols: []
  } 
}

class TweetComponent extends React.Component {
  render () {
    // use linkProps if you want to pass attributes to all links
    const linkProps = {target: '_blank', rel: 'noreferrer'}

    return (
      <Tweet data={tweetData} linkProps={linkProps} />
    )
  }
}
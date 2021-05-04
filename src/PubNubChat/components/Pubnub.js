import PubNub from 'pubnub'

export const pubnub = new PubNub({
    publishKey: process.env.REACT_APP_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_SUBSCRIBE_KEY,
})

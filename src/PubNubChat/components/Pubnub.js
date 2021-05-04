import PubNub from 'pubnub'

export const pubnub = new PubNub({
    // publishKey: 'pub-c-090e14f1-3e54-4e03-bef8-ad58c58476e9',
    // subscribeKey: 'sub-c-b6fbfee2-ab7d-11eb-8f4a-b6e2b128ec2a',
    publishKey: process.env.REACT_APP_PUBLISH_KEY,
    subscribeKey: process.env.REACT_APP_SUBSCRIBE_KEY,
    // uuid: 'USERNAME',
})

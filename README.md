# PubNub React app

## Info

-   to start the project use:

    > `yarn run start`

-   to run the project properly, you must:

1. Have a PubNub Profile with generated keys

2. create an `.env` file with the following `key=value` pairs

    > REACT_APP_PUBLISH_KEY=`your publish key`
    > REACT_APP_SUBSCRIBE_KEY=`your subscribe key`

3. Pass a **uuid** prop to the `<ChatContainer />` component, like this:

> `<ChatContainer uuid='username'/>`

\*_project only tested on localhost_

## version 0.2.1

-   patched `package.json` and `README.md`

## version 0.2.0

-   added sounds for message sending and recieving, when in a channel (offchannel notifications TBA)
    -   installed `use-sound` dependency
-   optimised messages, now they are fetched for the individual channel everytime you switch
-   formatted chat with colors and timestamps
-   added ability to pass username as a prop to the chat component
-   added `.env` file, to store API data

## version 0.1.0

-   chat functionality
-   channel switching
-   hardcoded name
-   hardcoded pubnub credentials

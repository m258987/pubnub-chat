import React, { useEffect } from 'react'

import { PubNubProvider } from 'pubnub-react'
import { pubnub } from './components/Pubnub'
import Chat from './components/Chat'

function ChatContainer({ uuid = 'defaultUser' }) {
    useEffect(() => {
        pubnub.setUUID(uuid)
        // eslint-disable-next-line
    }, [])

    return (
        <PubNubProvider client={pubnub}>
            <Chat />
        </PubNubProvider>
    )
}

export default ChatContainer

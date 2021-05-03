import React from 'react'

import { PubNubProvider } from 'pubnub-react'
import { pubnub } from './PubNubChat/Pubnub'
import Chat from './PubNubChat/Chat'

function App() {
    return (
        <PubNubProvider client={pubnub}>
            <Chat />
        </PubNubProvider>
    )
}

export default App

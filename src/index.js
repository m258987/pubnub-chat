import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import ChatContainer from './PubNubChat/ChatContainer'

ReactDOM.render(
    <React.StrictMode>
        <ChatContainer uuid="Vasil Kostadinov" />
    </React.StrictMode>,
    document.getElementById('root')
)

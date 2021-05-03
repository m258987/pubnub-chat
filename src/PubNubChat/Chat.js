import React, { useState, useEffect } from 'react'

import { usePubNub } from 'pubnub-react'

export default function Chat() {
    const pubnub = usePubNub()
    const [channels, setChannels] = useState(['You'])
    const [currentChannel, setCurrentChannel] = useState(channels[0])
    const [inputChannel, setInputChannel] = useState('')
    const [message, setMessage] = useState('')
    const [messagesByChannel, addMessagesByChannel] = useState({
        [channels[0]]: [],
    })

    useEffect(() => {
        const initialChannels = JSON.parse(localStorage.getItem('channels'))
        setChannels((prevState) => {
            return [...initialChannels]
        })
        setCurrentChannel(channels[0])
        pubnub.addListener({ message: handleMessage })

        //!presense
        pubnub.addListener({
            presence: handlePresense,
        })

        pubnub.subscribe({
            channels,
            withPresence: true,
            channelGroups: ['defaultChannel'],
        })

        pubnub.fetchMessages(
            { channels: initialChannels },
            (status, response) => {
                console.log(
                    'fetching messages for default channels',
                    status,
                    response
                )
                if (
                    !status.error &&
                    status.statusCode === 200 &&
                    response.channels &&
                    Object.keys(response.channels).length > 0 &&
                    response.channels.constructor === Object
                ) {
                    Object.keys(response.channels).forEach((element) => {
                        addMessagesByChannel((prevState) => {
                            return {
                                ...prevState,
                                [element]: [...response.channels[element]],
                            }
                        })
                    })
                }
            }
        )
    }, [])

    useEffect(() => {
        console.log(
            '%cAll channels and their messages',
            'color:orange;font-weight:bold;font-size:1.5em'
        )
        console.table(messagesByChannel)
        console.log('%ccurrent channel:', 'color:pink', currentChannel)
    }, [messagesByChannel, currentChannel])

    useEffect(() => {
        localStorage.setItem('channels', JSON.stringify(channels))
    }, [channels])

    const handleMessage = async (message) => {
        console.log('%cCHAT-EVENT', 'color:green')
        console.table(message)

        if (
            typeof message.message === 'string' ||
            message.message.hasOwnProperty('text')
        ) {
            addMessagesByChannel((prevState) => {
                return {
                    ...prevState,
                    [message.channel]: [...prevState[message.channel], message],
                }
            })
        }
    }

    const sendMessage = (message) => {
        if (message) {
            pubnub
                .publish({ channel: currentChannel, message })
                .then(() => setMessage(''))
        }
    }
    const addChannel = async (newChannelName) => {
        const array = [...channels]
        array.push(newChannelName)
        setChannels(array)

        console.log('%cchannels obj', 'color:red', array)

        usingPubnubFetch(newChannelName)

        if (!messagesByChannel[newChannelName]) {
            let allChannels = { ...messagesByChannel }
            allChannels[newChannelName] = [
                {
                    actualChannel: null,
                    channel: newChannelName,
                    message:
                        'You joined a brand new channel: ' + newChannelName,
                    publisher: 'chat',
                    subscribedChannel: newChannelName,
                    subscription: null,
                    timetoken: Date.now(),
                },
            ]
            addMessagesByChannel((prevState) => {
                return { ...prevState, ...allChannels }
            })
        }

        setCurrentChannel(newChannelName)
        pubnub.subscribe({
            channels: [newChannelName],
            withPresence: true,
        })

        console.log(
            '%call subbed channels',
            'color:yellow',
            pubnub.getSubscribedChannels()
        )

        localStorage.setItem('channels', JSON.stringify(channels))
    }

    const removeChannel = (channelName) => {
        setCurrentChannel(['You'])

        setChannels(channels.filter((channel) => channel !== channelName))

        pubnub.unsubscribe({ channels: [channelName] })
        console.log(
            '%call subbed channels',
            'color:yellow',
            pubnub.getSubscribedChannels()
        )

        localStorage.setItem('channels', JSON.stringify(channels))
        window.location.reload(false)
    }

    const removeAllChannels = () => {
        pubnub.unsubscribeAll()

        setChannels(['You'])

        localStorage.setItem('channels', JSON.stringify(channels))

        pubnub.subscribe({
            channels: ['You'],
            withPresence: true,
            channelGroups: ['defaultChannel'],
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (channels.includes(inputChannel)) {
            alert('you already have joined this channel')
            setInputChannel('')
            return
        }
        await addChannel(inputChannel)
        setInputChannel('')
    }

    const handleSelectChannel = (channel) => {
        setCurrentChannel(channel)

        pubnub.subscribe({ channel })

        if (
            messagesByChannel[channel] &&
            messagesByChannel[channel].length < 1
        ) {
            usingPubnubFetch(channel)
        }
    }

    const handlePresense = (event) => {
        // var action = event.action
        // var channelName = event.channel
        // var occupancy = event.occupancy
        // var eventTimetoken = event.timetoken
        // var occupantUUID = event.uuid
        // var state = event.state
        // var subscribeManager = event.subscription
    }

    const usingPubnubFetch = (channel) => {
        pubnub.fetchMessages({ channels: [channel] }, (status, response) => {
            console.log(
                'fetching messages for channel',
                channel,
                status,
                response
            )
            if (
                !status.error &&
                status.statusCode === 200 &&
                response.channels &&
                Object.keys(response.channels).length > 0 &&
                response.channels.constructor === Object
            ) {
                addMessagesByChannel((prevState) => {
                    return {
                        ...prevState,
                        [channel]: [...response.channels[channel]],
                    }
                })
            } else {
                addMessagesByChannel((prevState) => {
                    return {
                        ...prevState,
                        [channel]: [],
                    }
                })
            }
        })
    }

    return (
        <div style={pageStyles}>
            <div style={chatStyles}>
                <div style={headerStyles}>
                    <h3>Pubnub</h3>
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e)
                        }}
                    >
                        <input
                            placeholder={'join channel...'}
                            value={inputChannel}
                            onChange={(e) => setInputChannel(e.target.value)}
                        ></input>
                    </form>
                    <div style={channelStyles}>
                        Channels you have joined:
                        {channels.map((channel) => {
                            return (
                                <div
                                    key={channel}
                                    onClick={() => {
                                        handleSelectChannel(channel)
                                    }}
                                    style={
                                        channel === currentChannel
                                            ? activeChannelStyles
                                            : channelButtonStyles
                                    }
                                >
                                    {channel}
                                    {channel !== 'You' && (
                                        <button
                                            style={{
                                                position: 'absolute',
                                                right: '0',
                                                top: '0',
                                            }}
                                            onClick={() =>
                                                removeChannel(channel)
                                            }
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div style={listStyles}>
                    {messagesByChannel[currentChannel]?.map(
                        (message, index) => {
                            const time = new Date(
                                message.timetoken / 10000 + 10800000
                            )
                            return (
                                <div key={`message-${index}`}>
                                    <div>
                                        {message.publisher || message.uuid}:
                                        {time.toUTCString()}
                                    </div>
                                    <div style={messageStyles}>
                                        {message.message}
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
                <div style={footerStyles}>
                    <input
                        type="text"
                        style={inputStyles}
                        placeholder="Type your message"
                        value={message}
                        onKeyPress={(e) => {
                            if (e.key !== 'Enter') return
                            sendMessage(message)
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        style={buttonStyles}
                        onClick={(e) => {
                            e.preventDefault()
                            sendMessage(message)
                        }}
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    )
}

const activeChannelStyles = {
    fontWeight: 'bold',
    border: '3px solid red',
    backgroundColor: 'white',
    marginRight: '1em',
    fontWeight: 'bold',
    marginBottom: '1em',
    padding: '1em 0.5em',
    position: 'relative',
    boxSizing: 'border-box',
}
const channelButtonStyles = {
    fontWeight: 'bold',
    border: '1px solid black',
    backgroundColor: 'white',
    marginRight: '1em',
    fontWeight: 'bold',
    marginBottom: '1em',
    padding: '1em 0.5em',
    position: 'relative',
    boxSizing: 'border-box',
}

const channelStyles = {
    display: 'flex',
    overflowX: 'scroll',
    overflowY: 'hidden',
}

const pageStyles = {
    alignItems: 'center',
    background: 'black',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
}

const chatStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
}

const headerStyles = {
    background: 'darkorange',
    color: 'black',
    fontSize: '1.4rem',
    padding: '10px 15px',
}

const listStyles = {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
    padding: '10px',
}

const messageStyles = {
    backgroundColor: '#eee',
    borderRadius: '5px',
    color: '#333',
    fontSize: '1.1rem',
    margin: '5px',
    padding: '8px 15px',
}

const footerStyles = {
    display: 'flex',
}

const inputStyles = {
    flexGrow: 1,
    fontSize: '1.1rem',
    padding: '10px 15px',
}

const buttonStyles = {
    fontSize: '1.1rem',
    padding: '10px 15px',
}

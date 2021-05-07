import React, { useState, useEffect, useRef } from 'react'

import { usePubNub } from 'pubnub-react'
import useSound from 'use-sound'
import EmojiButton from './EmojiButton'
// import ReactButton from './ReactButton'

import './style.css'
import notificationSound from '../sounds/notification.mp3'
import sendMessageSound from '../sounds/sendMessage.mp3'

import loader from '../assets/loader.svg'
import chevron from '../assets/chevron.svg'

export default function Chat() {
    const pubnub = usePubNub()
    const [channels, setChannels] = useState([])
    const [currentChannel, setCurrentChannel] = useState('')
    const [inputChannel, setInputChannel] = useState('')
    const [message, setMessage] = useState('')
    const [messagesByChannel, addMessagesByChannel] = useState([])
    const [multiplier, setMultiplier] = useState(1)
    const [fetchDate, setFetchDate] = useState(Date.now() * 10000)
    const [playNotificationSound] = useSound(notificationSound)
    const [playSendMessageSound] = useSound(sendMessageSound)
    const [fetching, setFetching] = useState(false)
    const [channelsIsCollapsed, setCollapsedChannels] = useState(false)

    const scrollingComponent = useRef(null)

    //#region USE EFFECTS

    useEffect(() => {
        const initialChannels =
            JSON.parse(localStorage.getItem('channels')) || []

        setChannels((prevState) => {
            return [...initialChannels]
        })
        setCurrentChannel('')
        if (initialChannels.length > 0) {
            setCurrentChannel(initialChannels[0] || '')
            pubnub.subscribe({
                channels: [initialChannels[0]],
                withPresence: true,
                channelGroups: ['defaultChannel'],
            })

            usingPubnubFetch(initialChannels[0])
        }

        pubnub.addListener({ message: handleMessage })

        //!presense
        // prettier-ignore
        pubnub.addListener({ presence: handlePresense })

        pubnub.addListener({})

        // eslint-disable-next-line
    }, [])

    //?console logs
    useEffect(() => {
        //     console.log(
        //         '%cAll channels and their messages',
        //         'color:orange;font-weight:bold;font-size:1.5em'
        //     )
        //     console.table(messagesByChannel)
        console.log('%ccurrent channel:', 'color:pink', currentChannel)

        if (currentChannel) {
            getUsersInChannel(currentChannel)
        }

        // eslint-disable-next-line
    }, [currentChannel])
    //? end console logs

    useEffect(() => {
        localStorage.setItem('channels', JSON.stringify(channels))
        // eslint-disable-next-line
    }, [channels])

    useEffect(() => {
        if (!fetching) {
            scrollingComponent.current.scrollIntoView()
        }
        // eslint-disable-next-line
    }, [messagesByChannel])

    //#endregion USE EFFECTS

    const getUsersInChannel = (channel) => {
        channel !== '' &&
            pubnub.objects
                .getChannelMembers({ channel })
                .then((response) =>
                    console.log('members of channel ' + channel, response)
                )
    }

    const handleMessage = async (message) => {
        console.log('%cCHAT-EVENT', 'color:green')
        console.table(message)

        if (
            typeof message.message === 'string' ||
            message.message.hasOwnProperty('text')
        ) {
            addMessagesByChannel((prevState) => {
                return [...prevState, message]
            })
        }

        // if (
        //     message.publisher === pubnub.getUUID() ||
        //     message.uuid === pubnub.getUUID()
        // ) {
        playNotificationSound()
        // }
        if (currentChannel) {
            getUsersInChannel(currentChannel)
        }
    }

    const sendMessage = (message) => {
        if (message) {
            pubnub
                .publish({
                    channel: currentChannel,
                    message,
                    // meta: [{ uuid: 'Vasil Kostadinov', reaction: 1 }],
                })
                .then(() => setMessage(''))
                .then(() => playSendMessageSound())
        }
    }
    const addChannel = async (newChannelName) => {
        const array = [...channels]
        array.push(newChannelName)
        setChannels(array)

        console.log('%cchannels obj', 'color:red', array)
        setCurrentChannel(newChannelName)
        usingPubnubFetch(newChannelName)

        pubnub.unsubscribeAll()

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
        setMultiplier(1)
        setFetchDate(Date.now() * 10000)
        pubnub.unsubscribeAll()
        setCurrentChannel(channel)
        usingPubnubFetch(channel)
        pubnub.subscribe({ channels: [channel], withPresence: true })

        if (
            messagesByChannel[channel] &&
            messagesByChannel[channel].length < 1
        ) {
            usingPubnubFetch(channel)
        }
    }

    const handleEmoji = (emoji) => {
        setMessage((prevState) => {
            return prevState + emoji.emoji
        })
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

    const loadMoreMessages = () => {
        setFetching(true)
        setMultiplier(multiplier + 1)

        usingPubnubFetch(currentChannel, true, fetchDate)

        document.getElementsByClassName(
            `message-${messagesByChannel.length - 100 * multiplier - 1}`
        )
        setFetching(false)
    }

    const usingPubnubFetch = (
        channel,
        multipleFetch = false,
        start = Date.now() * 10000
    ) => {
        setFetching(true)
        pubnub.fetchMessages(
            { channels: [channel], start },
            (status, response) => {
                console.log(
                    `%cfetching messages for channel %c${channel}`,
                    'color: red;font-size: 2em;',
                    'color: orange;font-size: 2em;',
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
                    if (multipleFetch) {
                        addMessagesByChannel((prevState) => {
                            return [...response.channels[channel], ...prevState]
                        })
                    } else if (!multipleFetch) {
                        addMessagesByChannel((prevState) => {
                            return [...response.channels[channel]]
                        })
                    }
                    setFetchDate(response.channels[channel][0].timetoken)
                } else {
                    addMessagesByChannel((prevState) => {
                        return []
                    })
                }
            }
        )
        console.log('messages:', messagesByChannel)
        setFetching(false)
    }

    return (
        <div className={'pageStyles'}>
            <div
                onClick={() => setCollapsedChannels((prevState) => !prevState)}
                className={`hideChannelsButton ${
                    channelsIsCollapsed ? 'hideChannelsButtonCollapsed' : null
                }`}
            >
                <img src={chevron} alt="chevron" style={{ width: '100%' }} />
            </div>
            <div
                className={`channelStyles ${
                    channelsIsCollapsed ? 'channelsCollapsed' : null
                }`}
            >
                <h3>Chat</h3>
                <form
                    className={'channelsForm'}
                    onSubmit={(e) => {
                        handleSubmit(e)
                    }}
                >
                    <input
                        className={'channelsInput'}
                        placeholder={'Search...'}
                        value={inputChannel}
                        onChange={(e) => setInputChannel(e.target.value)}
                    ></input>
                </form>
                <div className="channelsList">
                    {channels.map((channel) => {
                        return (
                            <div
                                key={channel}
                                onClick={() => {
                                    handleSelectChannel(channel)
                                }}
                                className={
                                    channel === currentChannel
                                        ? 'activeChannelStyles'
                                        : 'channelButtonStyles'
                                }
                            >
                                {channel}

                                <button
                                    style={{
                                        position: 'absolute',
                                        right: '0',
                                        top: '0',
                                    }}
                                    onClick={() => removeChannel(channel)}
                                >
                                    X
                                </button>
                            </div>
                        )
                    })}
                </div>
                <div className="channelsProfile">
                    <h4>{pubnub.getUUID()}</h4>
                </div>
            </div>
            <div className={'chatStyles'}>
                <div className={'headerStyles'}>
                    channel: <b>{!!currentChannel && currentChannel}</b>
                </div>
                <div className={'listStyles'}>
                    {messagesByChannel.length >= 100 * multiplier && (
                        <button onClick={() => loadMoreMessages()}>
                            Load More Messages...
                        </button>
                    )}
                    {channels.length >= 1 ? (
                        messagesByChannel?.map((message, index) => {
                            const time = new Date(message.timetoken / 10000)
                            const formattedTime = `${time.getHours()}:${time.getMinutes()} ; ${time.getDate()}.${time.getMonth()}.${time.getUTCFullYear()}`
                            return (
                                <div
                                    key={`message-${index}`}
                                    className={`message-${index} message ${
                                        message.publisher ===
                                            pubnub.getUUID() ||
                                        message.uuid === pubnub.getUUID()
                                            ? 'clientMessageWrapper'
                                            : null
                                    }`}
                                >
                                    <div className="messageFormatedTime">
                                        {formattedTime}
                                    </div>
                                    <div>
                                        {message.publisher || message.uuid}:
                                    </div>
                                    <div
                                        className={`messageStyles ${
                                            message.publisher ===
                                                pubnub.getUUID() ||
                                            message.uuid === pubnub.getUUID()
                                                ? 'clientMessageStyles'
                                                : null
                                        }`}
                                    >
                                        {message.message}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'grid',
                                placeItems: 'center',
                            }}
                        >
                            {fetching ? (
                                <img
                                    src={loader}
                                    alt="loader"
                                    className="loader"
                                />
                            ) : (
                                <h2>Please enter a channel to chat</h2>
                            )}
                        </div>
                    )}
                    <div ref={scrollingComponent}></div>
                </div>
                <div className={'footerStyles'}>
                    <input
                        type="text"
                        className={'inputStyles'}
                        placeholder="Type your message"
                        value={message}
                        disabled={channels.length === 0}
                        onKeyPress={(e) => {
                            if (e.key !== 'Enter') return
                            sendMessage(message)
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <EmojiButton
                        handleEmoji={handleEmoji}
                        isDisabled={channels.length === 0}
                    />
                    <button
                        className={'buttonStyles'}
                        disabled={channels.length === 0}
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

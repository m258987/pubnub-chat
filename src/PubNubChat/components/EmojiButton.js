import React from 'react'

export default function EmojiButton({ handleEmoji, isDisabled }) {
    const toggleList = () => {
        document.querySelector('.emojiList').classList.toggle('emojiListHidden')
    }

    return (
        <div className="emojiHolder" disabled={isDisabled}>
            <div className="emojiList emojiListHidden" disabled={isDisabled}>
                {emojiList.map((emoji) => {
                    return (
                        <div
                            key={emoji.name + Math.random(0, 10000)}
                            className={`emoji emoji-${emoji.name}`}
                            onClick={() => {
                                handleEmoji(emoji)
                            }}
                        >
                            {emoji.emoji}
                        </div>
                    )
                })}
            </div>
            <div
                disabled={isDisabled}
                className="emojiButton"
                onClick={() => !isDisabled && toggleList()}
            >
                😀
            </div>
        </div>
    )
}

const emojiList = [
    { name: 'Grinning Face', emoji: '😀' },
    { name: 'Grinning Face with Big Eyes', emoji: '😃' },
    { name: ' Grinning Face with Smiling Eyes', emoji: '😄' },
    { name: 'Beaming Face with Smiling Eyes', emoji: '😁' },
    { name: 'Grinning Squinting Face', emoji: '😆' },
    { name: 'Grinning Face with Sweat', emoji: '😅' },
    { name: 'Rolling on the Floor Laughing', emoji: '🤣' },
    { name: 'Face with Tears of Joy', emoji: '😂' },
    { name: 'Slightly Smiling Face', emoji: '🙂' },
    { name: 'Upside-Down Face', emoji: '🙃' },
    { name: 'Winking Face', emoji: '😉' },
    { name: 'Smiling Face with Smiling Eyes', emoji: '😊' },
    { name: 'Smiling Face with Halo', emoji: '😇' },
    { name: 'Smiling Face with Hearts', emoji: '🥰' },
    //...repeating emojies from this point on
    { name: 'Grinning Face', emoji: '😀' },
    { name: 'Grinning Face with Big Eyes', emoji: '😃' },
    { name: ' Grinning Face with Smiling Eyes', emoji: '😄' },
    { name: 'Beaming Face with Smiling Eyes', emoji: '😁' },
    { name: 'Grinning Squinting Face', emoji: '😆' },
    { name: 'Grinning Face with Sweat', emoji: '😅' },
    { name: 'Rolling on the Floor Laughing', emoji: '🤣' },
    { name: 'Face with Tears of Joy', emoji: '😂' },
    { name: 'Slightly Smiling Face', emoji: '🙂' },
    { name: 'Upside-Down Face', emoji: '🙃' },
    { name: 'Winking Face', emoji: '😉' },
    { name: 'Smiling Face with Smiling Eyes', emoji: '😊' },
    { name: 'Smiling Face with Halo', emoji: '😇' },
    { name: 'Smiling Face with Hearts', emoji: '🥰' },
    { name: 'Grinning Face', emoji: '😀' },
    { name: 'Grinning Face with Big Eyes', emoji: '😃' },
    { name: ' Grinning Face with Smiling Eyes', emoji: '😄' },
    { name: 'Beaming Face with Smiling Eyes', emoji: '😁' },
    { name: 'Grinning Squinting Face', emoji: '😆' },
    { name: 'Grinning Face with Sweat', emoji: '😅' },
    { name: 'Rolling on the Floor Laughing', emoji: '🤣' },
    { name: 'Face with Tears of Joy', emoji: '😂' },
    { name: 'Slightly Smiling Face', emoji: '🙂' },
    { name: 'Upside-Down Face', emoji: '🙃' },
    { name: 'Winking Face', emoji: '😉' },
    { name: 'Smiling Face with Smiling Eyes', emoji: '😊' },
    { name: 'Smiling Face with Halo', emoji: '😇' },
    { name: 'Smiling Face with Hearts', emoji: '🥰' },
    { name: 'Grinning Face', emoji: '😀' },
    { name: 'Grinning Face with Big Eyes', emoji: '😃' },
    { name: ' Grinning Face with Smiling Eyes', emoji: '😄' },
    { name: 'Beaming Face with Smiling Eyes', emoji: '😁' },
    { name: 'Grinning Squinting Face', emoji: '😆' },
    { name: 'Grinning Face with Sweat', emoji: '😅' },
    { name: 'Rolling on the Floor Laughing', emoji: '🤣' },
    { name: 'Face with Tears of Joy', emoji: '😂' },
    { name: 'Slightly Smiling Face', emoji: '🙂' },
    { name: 'Upside-Down Face', emoji: '🙃' },
    { name: 'Winking Face', emoji: '😉' },
    { name: 'Smiling Face with Smiling Eyes', emoji: '😊' },
    { name: 'Smiling Face with Halo', emoji: '😇' },
    { name: 'Smiling Face with Hearts', emoji: '🥰' },
    { name: 'Grinning Face', emoji: '😀' },
    { name: 'Grinning Face with Big Eyes', emoji: '😃' },
    { name: ' Grinning Face with Smiling Eyes', emoji: '😄' },
    { name: 'Beaming Face with Smiling Eyes', emoji: '😁' },
    { name: 'Grinning Squinting Face', emoji: '😆' },
    { name: 'Grinning Face with Sweat', emoji: '😅' },
    { name: 'Rolling on the Floor Laughing', emoji: '🤣' },
    { name: 'Face with Tears of Joy', emoji: '😂' },
    { name: 'Slightly Smiling Face', emoji: '🙂' },
    { name: 'Upside-Down Face', emoji: '🙃' },
    { name: 'Winking Face', emoji: '😉' },
    { name: 'Smiling Face with Smiling Eyes', emoji: '😊' },
    { name: 'Smiling Face with Halo', emoji: '😇' },
    { name: 'Smiling Face with Hearts', emoji: '🥰' },
    //add more to the array...
]

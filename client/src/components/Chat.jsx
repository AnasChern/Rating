import { useState } from "react";
import Avatar from "react-avatar";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { isMessageOrUserEvent, SERVER_URL } from "../App";

export default function Chat() {
    const [userMessage, setUserMessage] = useState('');
    const { lastJsonMessage, sendJsonMessage } = useWebSocket(SERVER_URL, {
        share: true,
        filter: isMessageOrUserEvent,
    });
    const messages = lastJsonMessage?.data?.messages || [];
    const userId = lastJsonMessage?.data?.userId || null;

    function sendMessage() {
        if (userMessage) {
            sendJsonMessage({
                type: 'messagesend',
                content: userMessage,
                userId,
            });
            setUserMessage('');
        }
    }

    return (
        <section className="msger">
            <header className="msger-header">
                <div className="msger-header-title">
                    <i className="fas fa-comment-alt"></i> SimpleChat
                </div>
                <div className="msger-header-options">
                    <span>
                        <i className="fas fa-cog"></i>
                    </span>
                </div>
            </header>

            <main className="msger-chat">
                {messages.map((message) => (
                    <div className="msg left-msg" key={message.date}>
                        <Avatar name={message?.user?.username} size={40} round="20px" />

                        <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-name">{message?.user?.username}</div>
                            </div>

                            <div className="msg-text">{message.content}</div>
                        </div>
                    </div>
                ))}
            </main>

            <div className="msger-inputarea">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="msger-input"
                    placeholder="Enter your message..."
                />
                <button type="button" onClick={sendMessage} className="msger-send-btn">
                    Send
                </button>
            </div>
        </section>
    );
}
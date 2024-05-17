import React, { useState } from "react";

function ChatWindow({ onSendMessage, chatMessages }) {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <textarea
        className="chat-input"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message..."
      />
      <button className="chat-button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatWindow;
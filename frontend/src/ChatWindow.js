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
      <textarea
        className="chat-input"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message to refine the recommendations below ..."
      />
      <button className="chat-button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatWindow;

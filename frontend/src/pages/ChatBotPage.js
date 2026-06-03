import React, { useState } from 'react';

/**
 * WhatsApp-like chat interface for your Fashion Muse AI chatbot.
 */
function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    // Prevent empty messages
    if (!input.trim()) return;

    // Add user's message to local state
    setMessages((prev) => [...prev, { text: input, user: true }]);

    // Call your Flask AI endpoint
    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();

      // Add AI's reply to local state
      setMessages((prev) => [...prev, { text: data.reply, user: false }]);
    } catch (error) {
      // In case of an error, show error text
      setMessages((prev) => [...prev, { text: "Error contacting AI", user: false }]);
    }

    // Clear input box
    setInput("");
  };

  return (
    <div className="page-container">
      <h2>AI-Powered Chatbot</h2>

      {/* The bubble-based chat area */}
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.user ? 'user-bubble' : ''}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input + Send button row */}
      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatbotPage;

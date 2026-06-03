import React, { useState } from 'react';

function VirtualMuscat() {
  const [reply, setReply] = useState("");
  const [input, setInput] = useState("");

  const askAssistant = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/virtual-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (error) {
      setReply("Error contacting Virtual Muscat Assistant");
    }
    setInput("");
  };

  const speakReply = () => {
    if (reply) {
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="page-container">
      <h2>Virtual Muscat Assistant</h2>
      <p>Ask for real-time style advice, outfit suggestions, or makeup tips.</p>
      <div style={{ margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '70%', padding: '0.5rem' }}
        />
        <button onClick={askAssistant} style={{ padding: '0.5rem 1rem' }}>Ask</button>
      </div>
      {reply && (
        <div style={{ marginTop: '1rem' }}>
          <p>{reply}</p>
          <button onClick={speakReply} style={{ padding: '0.5rem 1rem' }}>🔊 Speak</button>
        </div>
      )}
    </div>
  );
}

export default VirtualMuscat;

import React from 'react';

function VoiceButton({ text }) {
  const speakText = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button onClick={speakText}>🔊 Speak</button>
  );
}

export default VoiceButton;

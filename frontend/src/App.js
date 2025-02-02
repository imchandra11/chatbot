import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = new WebSocket("ws://localhost:5000");
import "./App.css";
const VoiceChatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    socket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const audioUrl = URL.createObjectURL(event.data);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        const response = JSON.parse(event.data);
        setChat((prev) => [...prev, { type: "bot", text: response.text }]);
      }
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setChat((prev) => [...prev, { type: "user", text: message }]);
      socket.send(message);
      setMessage("");
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    recognition.start();
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setMessage(transcript);
    setIsRecording(false);
  };

  return (
    <div className="container">
      <h2>Voice Chatbot</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <p key={index} className={`chat-message ${msg.type}`}>
            {msg.type === "user" ? "You: " : "Bot: "} {msg.text}
          </p>
        ))}
      </div>
      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="send-btn" onClick={sendMessage}>Send</button>
      <button className="record-btn" onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Listening..." : "Speak"}
      </button>
    </div>
  );
};

export default VoiceChatbot;

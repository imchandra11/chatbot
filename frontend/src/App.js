import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = new WebSocket("ws://localhost:5000");

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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto"}}>
      <h2>Voice Chatbot</h2>
      <div style={{ border: "2px solid red", padding: "10px", height: "300px", overflowY: "auto" }}>
        {chat.map((msg, index) => (
          <p key={index} style={{ color: msg.type === "user" ? "blue" : "green" }}>
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
      <button onClick={sendMessage}>Send</button>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Listening..." : "Speak"}
      </button>
    </div>
  );
};

export default VoiceChatbot;

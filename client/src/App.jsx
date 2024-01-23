// App.js

import "./App.css";
import io from "socket.io-client";
import { useEffect, useState,useRef  } from "react";
const socket = io.connect("http://localhost:3001");

// ... (existing code)

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState(""); // Initialize with an empty string
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room, userName });
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room, userName });
    setMessage("");
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useEffect(() => {
    // Generate a unique user name
    const generatedUserName = `user${Math.floor(Math.random() * 1000)}`;
    setUserName(generatedUserName);

    // Set up event listeners
    const receiveMessageHandler = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      // Cleanup on component unmount
      socket.off("receive_message", receiveMessageHandler);
    };
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h2>Chat App</h2>
      </div>

      <div className="input-container">
        <input
          placeholder="Enter room name"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div className="messages" ref={messagesRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === socket.id ? "sent" : "received"
            }`}
          >
            <div className="message-body">{msg.message}</div>
            <div className="message-header">
              {msg.senderName ? (
                <span className="sender-chip">
                  Send By: {msg.senderId === socket.id ? "Me" : msg.senderName}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default App;

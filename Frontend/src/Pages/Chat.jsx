import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const location = useLocation();
  const username = location.state?.username || "Anonymous";

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { message, username });
      setMessage("");
    }
  };

  useEffect(() => {
    const receiveMessage = (data) => {
      setChat((prevChat) => [...prevChat, data]);
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="absolute top-0 z-10 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="h-[100vh] w-[100vw] flex-col">
        <p className="text-center py-4 text-4xl font-bold text-purple-200">
          Welcome, {username}
        </p>
        <div className="grid grid-cols-4 h-[85vh] mx-10 gap-1">
          <div className="col-span-1 bg-[rgba(120,120,120,0.2)] rounded-md"></div>
          <div className="relative col-span-3 bg-[rgba(120,120,120,0.2)] rounded-md p-4">
            <div className="overflow-y-auto h-[80vh]">
              {chat.map((msg, index) => (
                <p
                  key={index}
                  className={`mb-2 text-white ${
                    msg.username === username ? "text-right" : "text-left"
                  }`}
                >
                  <strong>{msg.username}</strong>: {msg.message}
                </p>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="absolute bottom-4 left-4 p-2 bg-white text-black rounded-md focus:outline-none"
              placeholder="Write Something..."
            />
            <button
              onClick={sendMessage}
              className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3001");
function Home() {
  // const [message,setMessage] = useState()
  const sendMessage = () => {
    socket.emit("send_message", { message: "hello" });
  };
  return (
    <div>
      <input placeholder="username.." />
      <button onClick={sendMessage}>Join the Chat</button>
    </div>
  );
}

export default Home;

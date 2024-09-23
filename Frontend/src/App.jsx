/* eslint-disable no-unused-vars */
// import { useEffect } from "react";
import Users from "./components/Users";
import Chat from "./Pages/Chat";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/chat" element={<Chat />}></Route>
    </Routes>
  );
}

export default App;

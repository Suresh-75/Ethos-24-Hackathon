/* eslint-disable no-unused-vars */
// import { useEffect } from "react";
import Chat from "./Pages/Chat";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import "@radix-ui/themes/styles.css";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/chat" element={<Chat />}></Route>
    </Routes>
  );
}

export default App;

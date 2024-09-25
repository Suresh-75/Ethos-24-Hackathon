/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="h-[15vh] flex justify-center items-center">
        <h1 className="text-white font-bold">Ethos '24</h1>
      </div>
      <div className="h-[85vh] w-[100vw] flex flex-col  justify-center items-center">
        <input
          className="px-2 py-1 mb-1 rounded-md text-lg"
          placeholder="username.."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={() => {
            if (username.trim()) {
              navigate("/chat", { state: { username } });
            }
          }}
        >
          Join the Chat
        </button>
      </div>
    </div>
  );
}

export default Home;

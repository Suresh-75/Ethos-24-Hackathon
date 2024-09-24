import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div className="h-[100vh] w-[100vw] bg-violet-300 flex flex-col  justify-center items-center">
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
  );
}

export default Home;

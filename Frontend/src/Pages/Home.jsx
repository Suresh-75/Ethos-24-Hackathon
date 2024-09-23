import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <input
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

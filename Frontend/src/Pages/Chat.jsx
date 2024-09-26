import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Users from "../components/Users";
import ChatSpace from "../components/ChatSpace";
import E2EE from "@chatereum/react-e2ee";
const socket = io.connect("http://localhost:8000");

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelUser] = useState();
  const [selectedUserName, setSelUserName] = useState();
  const location = useLocation();

  //keys
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  const username = location.state?.username || "Anonymous";

  useEffect(() => {
    let c = [];
    chat.forEach((ch) => {
      if (ch.username == selectedUserName) {
        c = ch.chats;
      }
    });
    setSelectedChat(c);
  }, [chat, selectedUserName]);

  function onSelectFriend(name) {
    let c = [];
    chat.forEach((ch) => {
      if (ch.username == name) {
        c = ch.chats;
      }
    });
    setSelectedChat(c);
  }

  const sendMessage = async () => {
    if (message.trim()) {
      setChat((prevChat) => [...prevChat, { message, username, selectedUser }]);
      const newChat = chat;
      newChat.forEach((ch) => {
        if (ch.username == selectedUserName) {
          ch.chats.push({ sender: username, msg: message });
        }
      });
      setChat(newChat);

      let publicKeyOfFrnd = null;

      users.forEach((ch) => {
        if (ch.username == selectedUserName) {
          publicKeyOfFrnd = ch.key;
          return;
        }
      });

      const encrypted = await E2EE.encryptPlaintext({
        public_key: publicKeyOfFrnd,
        plain_text: message,
      });

      socket.emit("send_message", { encrypted, username, selectedUser });
      setMessage("");
    }
  };
  useEffect(() => {
    (async () => {
      const keys = await E2EE.getKeys();
      setPublicKey(keys.public_key);
      setPrivateKey(keys.private_key);
      socket.emit("user-connected", { username, key: keys.public_key });
    })();
  }, [username]);
  useEffect(() => {
    const getUsers = (d) => {
      const newU = d.users.filter((u) => {
        return u.username != username;
      });
      const uniqueUsersByUsername = newU.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.username === user.username)
      );
      setUsers(uniqueUsersByUsername);
      const newChat = [];
      uniqueUsersByUsername.forEach((u) => {
        newChat.push({ username: u.username, chats: [] });
      });
      setChat(newChat);
    };
    socket.on("All-Users", getUsers);

    // get chat from server
    const receiveMessage = async (data) => {
      try {
        const decrypted = await E2EE.decryptForPlaintext({
          encrypted_text: data.encrypted,
          private_key: privateKey,
        });
        console.log(decrypted);
        const newChat = chat;
        newChat.forEach((ch) => {
          if (ch.username == data.username) {
            ch.chats.push({ sender: data.username, msg: decrypted });
          }
        });
        setChat([...newChat]);
      } catch (e) {
        console.log(e);
      }
      // if (data.username == selectedUserName) onSelectFriend(data.username);
    };
    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("All-Users", getUsers);
    };
  }, [chat, selectedUserName, username]);

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
          <Users
            users={users}
            selectedUser={selectedUser}
            setSelUser={setSelUser}
            setSelUserName={setSelUserName}
            setSelectedChat={setSelectedChat}
            onSelectFriend={onSelectFriend}
            chat={chat}
          />
          <div className="relative col-span-3 bg-[rgba(120,120,120,0.2)] rounded-md p-4">
            <ChatSpace
              selectedUser={selectedUser}
              selectedChat={selectedChat}
              username={username}
              message={message}
              setMessage={setMessage}
              handleKeyPress={handleKeyPress}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

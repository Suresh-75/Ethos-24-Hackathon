import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Users from "../components/Users";
import ChatSpace from "../components/ChatSpace";
import {
  arrayBufferToBase64,
  decryptMessage,
  encryptMessage,
  exportPrivateKeyToBase64,
  exportPublicKey,
  generateKeyPair,
  parsePublicKey,
} from "../../Encrypt/enc";
generateKeyPair;
const socket = io.connect("http://localhost:8000");

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelUser] = useState();
  const [selectedUserName, setSelUserName] = useState();
  const [keys, setKeys] = useState({});
  const [base64Key, setBase64Key] = useState(null);
  const location = useLocation();
  const username = location.state?.username || "Anonymous";

  useEffect(() => {
    (async function n() {
      const k = await generateKeyPair();
      const keyP = await exportPublicKey(k.publicKey);
      const key = arrayBufferToBase64(keyP);
      const privateBase64 = await exportPrivateKeyToBase64(k.privateKey);
      // console.log(privateBase64);
      if (base64Key == null) setBase64Key(privateBase64);
      setKeys(k);
      socket.emit("user-connected", { username, key });
    })();
  }, [base64Key, username]);

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

  async function sendMessage() {
    if (message.trim()) {
      setChat((prevChat) => [...prevChat, { message, username, selectedUser }]);
      const newChat = chat;
      let publicKeyBase64 = null;
      newChat.forEach((ch) => {
        if (ch.username == selectedUserName) {
          ch.chats.push({ sender: username, msg: message });
        }
      });
      setChat(newChat);
      users.forEach((ch) => {
        if (ch.username == selectedUserName) {
          publicKeyBase64 = ch.key;
        }
      });

      //encryption
      const publicKey = await parsePublicKey(publicKeyBase64);
      const encryptedMessage = await encryptMessage(message, publicKey);
      const base64EncryptedMessage = arrayBufferToBase64(encryptedMessage);
      socket.emit("send_message", {
        base64EncryptedMessage,
        username,
        selectedUser,
      });
      setMessage("");
    }
  }

  useEffect(() => {
    (async () => {
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
        if (base64Key != undefined) {
          const deMsg = await decryptMessage(
            base64Key,
            data.base64EncryptedMessage
          );
          const newChat = chat;
          newChat.forEach((ch) => {
            if (ch.username == data.username) {
              ch.chats.push({ sender: data.username, msg: deMsg });
            }
          });
          setChat([...newChat]);
        }
      };
      socket.on("receive_message", receiveMessage);
      return () => {
        socket.off("receive_message", receiveMessage);
        socket.off("All-Users", getUsers);
      };
    })();
  }, [base64Key, chat, keys, selectedUserName, username]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="absolute top-0 z-10 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="h-[100vh] w-[100vw] flex-col">
        <p className="text-center py-4 text-4xl font-bold bg-gradient-to-r from-violet-900  to-white bg-clip-text text-transparent">
          Welcome, {username}
        </p>
        <div className="flex w-[100vw] justify-center items-center">
          <div className="grid grid-cols-4 h-[85vh] w-[70%] mx-10 gap-1">
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
    </div>
  );
}

export default Chat;

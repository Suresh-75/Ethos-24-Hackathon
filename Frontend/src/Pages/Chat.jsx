import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:8000");

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelUser] = useState();
  const [selectedUserName, setSelUserName] = useState();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";
  const sendMessage = () => {
    if (message.trim()) {
      setChat((prevChat) => [...prevChat, { message, username, selectedUser }]);
      socket.emit("send_message", { message, username, selectedUser });
      setMessage("");
    }
  };
  useEffect(() => {
    socket.emit("user-connected", { username });
  }, [username]);
  useEffect(() => {
    const receiveMessage = (data) => {
      console.log(data.username, " ", selectedUserName);
      if (data.username != selectedUserName) return;
      console.log(data);
      setChat((prevChat) => [...prevChat, data]);
      console.log([...chat, data]);
    };
    const getUsers = (d) => {
      console.log(d.users);
      const newU = d.users.filter((u) => {
        return u.username != username;
      });
      const uniqueUsersByUsername = newU.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.username === user.username)
      );

      setUsers(uniqueUsersByUsername);
    };
    socket.on("All-Users", getUsers);
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
          <div className="col-span-1 bg-[rgba(120,120,120,0.2)] rounded-md">
            {users.map((u, index) => {
              return (
                <Box
                  key={index}
                  onClick={() => {
                    if (selectedUser == u.id) return;
                    setSelUser(u.id);
                    setSelUserName(u.username);
                    setChat([]);
                  }}
                >
                  <Card className="bg-white transition hover:bg-purple-200 hover:cursor-pointer">
                    <Flex gap="2" align="center">
                      <Avatar
                        size="4"
                        // src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                        radius="full"
                        fallback={u.username.split("")[0]}
                      />
                      <Box>
                        <Text as="div" size="5" weight="bold">
                          {u.username}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          heyy
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Box>
              );
            })}
          </div>
          <div className="relative col-span-3 bg-[rgba(120,120,120,0.2)] rounded-md p-4">
            <div className="overflow-y-auto h-[80vh]">
              {selectedUser ? (
                <>
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
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="absolute bottom-4 left-4 p-2 bg-white text-black rounded-md w-[90%] focus:outline-none"
                    placeholder="Write Something..."
                  />
                  <button
                    onClick={sendMessage}
                    className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md"
                  >
                    Send Message
                  </button>
                </>
              ) : (
                <div className="flex justify-center items-center text-2xl font-semibold text-white h-[100%]">
                  <p>Select an user</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

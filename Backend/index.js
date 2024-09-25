const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let users = [];
io.on("connection", (socket) => {
  socket.on("user-connected", (payload) => {
    // console.log(payload);
    const newUser = {
      username: payload.username,
      id: socket.id,
      key: payload.key,
    };
    users.push(newUser);
    // console.log(users);
    io.emit("All-Users", { users });
  });
  socket.on("send_message", (payload) => {
    console.log(payload);
    const sId = payload.selectedUser;
    const isThere = users.some((u) => {
      return u.id == sId;
    });
    if (isThere) io.to(sId).emit("receive_message", payload);
  });
  socket.on("disconnect", () => {
    users = users.filter((user) => {
      return user.id != socket.id;
    });
    io.emit("All-Users", { users });
  });
});

server.listen(8000, () => {
  console.log("Server running");
});

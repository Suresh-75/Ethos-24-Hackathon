const app = require("./app.js");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const connectedUsers = [];

const io = new Server(server);
io.on("connection", (socket) => {
  connectedUsers.push(socket.id);
  console.log("a user connected");
});

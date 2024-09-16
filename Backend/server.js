const app = require("./app.js");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = new Server(server);
io.on("connection", (socket) => {
  console.log("a user connected");
});

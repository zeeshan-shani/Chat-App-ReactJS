// server.js

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  const senderName = socket.id[1] + socket.id[2];
  socket.on("join_room", (data) => {
    socket.join(data.room);
    io.to(data.room).emit("receive_message", {
      message: `User: "${socket.id[1]}${socket.id[2]}" joined the room.`,
    });
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", {
      message: data.message,
      senderId: socket.id,
      senderName: senderName,
    });
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});

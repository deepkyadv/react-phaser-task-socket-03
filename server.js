const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // To allow cross-origin requests

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "react-phaser-task-02.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

let currentMove = null;

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current move to the newly connected user
  socket.emit('updateMove', currentMove);

  // Listen to the moveBall event and broadcast it to all clients
  socket.on('moveBall', (direction) => {
    currentMove = direction;
    io.emit('updateMove', direction); // Broadcast the move to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});

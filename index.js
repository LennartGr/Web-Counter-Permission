const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// in order to call the client.js script inside index.html 
// (but not as an inline script),
// we have to serve index.html statically
app.use(express.static("public"))

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
    socket.on("chat message", (msg) => {
        console.log(`message ${msg}`)
    })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});
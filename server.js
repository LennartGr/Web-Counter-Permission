const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// if we deploy with render, first line is important
const port = process.env.PORT || 3000;

let counterValue = 0

// in order to call the client.js script inside index.html 
// (but not as an inline script),
// we have to serve index.html statically
app.use(express.static("public"))

let clientSockets = []
let activeSocket = null

function forgetClientSocket(id) {
    // special case: delete active socket
    if (activeSocket.id === id && clientSockets.length > 1) {
        changePermission()
    } else if (activeSocket.id === id && clientSockets.length === 1) {
        activeSocket = null
    }
    // filter out the socket that shall be deleted
    clientSockets = clientSockets.filter(socket => socket.id !== id)
}

function changePermission() {
    // socket.IO DOES guarantee message ordering, so we do not need to pay attention if there is only one socket
    io.to(activeSocket.id).emit("remove-permission")
    // get index of active socket
    let i = clientSockets.findIndex(socket => socket.id === activeSocket.id)
    activeSocket = clientSockets[(i + 1) % clientSockets.length]
    io.to(activeSocket.id).emit("set-permission")
}

io.on("connection", (socket) => {
    console.log(`server recognized new connection with ${socket.id}`)
    clientSockets.push(socket)
    // the first client that connects has permission to increment the button
    if (clientSockets.length === 1) {
        activeSocket = socket
        io.to(activeSocket.id).emit("set-permission")       
    }
    // update client's counter upon connecting to servers
    // NOT socket.to(socket.id).emit() because this sends the message to everyone in the room EXPECT socket
    io.to(socket.id).emit("set-value", counterValue)

    socket.on("disconnect", () => {
        forgetClientSocket(socket.id)
        console.log("user disconnected")
    })
    // when a client asks for an increment, send updated counter value to everyone
    socket.on("increment", (msg) => {
        console.log("received increment")
        counterValue++
        io.emit("set-value", counterValue)
        //change permission
        changePermission()
        console.log(`new permission id is ${activeSocket.id}`)
    })
})

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
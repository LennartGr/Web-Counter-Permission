const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let counterValue = 0

// in order to call the client.js script inside index.html 
// (but not as an inline script),
// we have to serve index.html statically
app.use(express.static("public"))

let clientSockets = []
let permissionId;

function forgetClientSocket(id) {
    clientSockets = clientSockets.filter(socket => socket.id !== id)
}

function getNextSocket(id) {
    let i = clientSockets.findIndex(socket => socket.id === id)
    return clientSockets[i % clientSockets.length]
}

io.on("connection", (socket) => {
    console.log(`server recognized new connection with ${socket.id}`)
    clientSockets.push(socket)
    // the first client that connects has permission to increment the button
    if (clientSockets.length === 1) {
        permissionId = socket.id
        io.to(permissionId).emit("set-permission")       
    }
    // update client's counter upon connecting to servers
    // NOT socket.to(socket.id).emit() because this sends the message to everyone in the room EXPECT socket
    io.to(socket.id).emit("set-value", counterValue)

    socket.on("disconnect", () => {
        if (permissionId === socket.id) {
            //TODO
        }
        forgetClientSocket(socket.id)
        console.log("user disconnected")
    })
    // when a client asks for an increment, send updated counter value to everyone
    socket.on("increment", (msg) => {
        console.log("received increment")
        counterValue++
        io.emit("set-value", counterValue)
        //change permission
        io.to(socket.id).emit("remove-permission")
        permissionId = getNextSocket(socket.id).id
        console.log(`new permission id is ${permissionId}`)
        io.to(permissionId).emit("set-permission")
    })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});
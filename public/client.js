var socket = io();

var counter = document.getElementById("counter")
var incrementButton = document.getElementById("increment")

var permission = false
document.getElementById("permission").innerHTML = "NO permission"

incrementButton.addEventListener('click', function(e) {
    console.log("button clicked")
    if (permission) {
        socket.emit("increment")
    }
})

socket.on("set-permission", () => {
    permission = true
    document.getElementById("permission").innerHTML = "permission"
})

socket.on("remove-permission", () => {
    permission = false
    document.getElementById("permission").innerHTML = "NO permission"
})

socket.on("connect", () => {
    console.log(`client learned its own id: ${socket.id}`)
});

socket.on("set-value", function(val) {
    console.log("set value inside client")
    counter.innerHTML = val + ""
})



/*
socket.on("chat message", function(msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})
*/
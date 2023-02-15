var socket = io();

var counter = document.getElementById("counter")
var incrementButton = document.getElementById("increment")
counter.innerHTML = "0"

incrementButton.addEventListener('click', function(e) {
    console.log("button clicked")
    socket.emit("increment")
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
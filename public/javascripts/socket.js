// Client side socket

const socket = io("https://localhost:3000/");
socket.on("connect", () => {
  console.log('connect', socket.id);



  const payload = {
    oid: getCookie('oid')
  };
  // emit
  socket.emit("map_socket", payload);
  console.log('emitted');
});

socket.on("broadcast_message", (payload) => {
  console.log('have new message', payload);
});

socket.on("disconnect", () => {
  console.log('disconnect');
});

function sendMessage(e){
  let text = document.getElementById('').value;
  socket.emit("send_message", {
    text
  })
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
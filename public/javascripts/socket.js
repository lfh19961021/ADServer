// Client side socket
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('text').onkeydown = function(e) {
  if (e.key == "Enter") {
    document.getElementById('sendButton').click();
  }
};

const socket = io("https://localhost:3000/");
socket.on("connect", () => {
  console.log('connect', socket.id);

  const payload = {
    oid: getCookie('oid'),
    userName: getCookie('userName')
  };

  // emit
  socket.emit("map_socket", payload);
  console.log('emitted');
}, (payload) => {
    console.log('socket mapped');
    addJoinUser();
});

socket.on("broadcast_message", (payload) => {
  console.log('have new message', payload);
  addNewMessage(payload);
});

socket.on("disconnect", () => {
  console.log('disconnect');
});



function sendMessage() {
  let textbox = document.getElementById('text');
  console.log('sending', textbox.value);
  setLoading(true);
  


  socket.emit("send_message", {
    text: textbox.value,
    by: socket.id,
    timestamp: Date.now()
  }, (response) => {
    console.log(response.status); // ok
    textbox.value = "";
    setLoading(false);
    textbox.focus();
  })
}

function setLoading(isLoading){
  let textbox = document.getElementById('text');
  let sendText = document.getElementById('sendText');
  let loadingRing = document.getElementsByClassName('lds-ring')[0];

  if(isLoading){
    textbox.setAttribute('disabled', 'true')
    sendText.classList.toggle('d-none');
    loadingRing.classList.toggle('d-none');
  }else{
    textbox.removeAttribute('disabled')
    sendText.classList.toggle('d-none');
    loadingRing.classList.toggle('d-none');
  }
}

function addJoinUser(user){
  let roomWrappepr = document.getElementById('roomWrappepr');
  let newJoinerDom = document.createElement('div');

  

}

function addNewMessage(message){
  let roomWrappepr = document.getElementById('roomWrappepr');
  let newMessageDom = document.createElement('div');

  let bynode = document.createTextNode(decodeURI((message.userName || message.by)) + ': ');
  let textnode = document.createTextNode(message.text);
  let timestampnode = document.createTextNode(new Date(message.timestamp));

  newMessageDom.appendChild(bynode);
  newMessageDom.appendChild(document.createElement("br"));
  newMessageDom.appendChild(textnode);
  newMessageDom.appendChild(document.createElement("br"));
  newMessageDom.appendChild(timestampnode);
  newMessageDom.appendChild(document.createElement("br"));
  newMessageDom.appendChild(document.createElement("br"));

  roomWrappepr.appendChild(newMessageDom);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
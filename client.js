const socket = io()


let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message_area')
do{
    name = prompt('please enter your name: ')
}while(!name)

textarea.addEventListener('Keyup', (e) => {
    if(e.key ==="Enter"){
        sendMessage(e.target.value)
    }
})

function sendMessage(msg){
    let msg={
        user:name,
        message:msg
    }

    appenedMessage(msg, 'Outgoing')
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(classNmae, 'message')

    let marekup =`
    <h4>${msg.user}/</h4>
    <p>${msg.message}</p>
`
mainDiv.innerHTML = marekup

messageArea.appendChild(mainDiv)
}

//socket
// Client-side
const soc = io.connect('http://localhost:3000');

socket.on('message', (message) => {
  console.log(`Received message: ${message.text}`);
  // Display the message in the chat window
});

socket.emit('message', {
  text: 'Hello, world!',
  userId: '123',
  groupId: 'abc'
});

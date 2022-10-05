const socket = io('http://localhost:8000');


const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')

var audio = new Audio('ting.mp3');

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position == 'left'){
        console.log('sound is playing');
        audio.play();
    }
}

function handleEncrypt() {
    const inp = document.getElementById('msg');
    const msg = inp.value;
    const pbkey = document.getElementById('pub-key');
    const publicKey = pbkey.value;

    const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({
        text: msg,
        publicKey,
    });
    console.log(encryptedText);
    const ans = document.getElementById('ans-area');
    ans.value = encryptedText;
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

const newName = prompt("Enter your name to join Secure Chat");
socket.emit('new-user-joined', newName)

socket.on('user-joined', (name, publicKey)=>{
    // append(`${name} joined the chat`, 'right');
    append(`${name} joined the chat,  ${publicKey}`, 'right');
})

socket.on("new_msg", function (data) {
    // alert(data.msg);
    append(`${data.msg}`, 'right');
})

socket.on('receive', data=>{
    append(`${data.name }: ${data.message}`, 'left')
})

socket.on('left', name=>{
    append(`${name } left the chat`, 'left');
})
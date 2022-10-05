// node server which will handle socket io connections
const io = require("socket.io")(8000);
const users = {};

// rsa-encrpyt
const EncryptRsa = require('encrypt-rsa').default;



// As soon as we encounter a connection
io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        const encryptRsa = new EncryptRsa();
        const { privateKey, publicKey } = encryptRsa.createPrivateAndPublicKeys();
        console.log("New user", name);
        //console.log(privateKey);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name, publicKey);
        io.sockets.in(socket.id).emit('new_msg', { msg: `hello, this is your private key: ${privateKey}` });
    });

    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message=>{
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
    });
})

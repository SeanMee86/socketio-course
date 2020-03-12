const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, console.log(`listening on port 9000`));
const io = socketio(expressServer);

io.on('connection', socket => {
    socket.emit('messageFromServer', {data: "Welcome to the socketio server"});
    socket.on('dataToServer', dataFromClient => {
        console.log(dataFromClient);
    });
    socket.on('newMessageToServer', msg => {
        io.emit('messageToClients', {text: msg.text})
    });
    io.of('/admin').emit('welcome', "welcome to the admin channel from the main channel")
});

io.of('/admin').on('connection', () => {
    console.log('Admin socket connected');
    io.of('/admin').emit('welcome', "Welcome to admin channel")
});
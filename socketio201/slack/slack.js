const express = require('express');
const app = express();
const socketio = require('socket.io');
let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000, console.log(`listening on port 9000`));
const io = socketio(expressServer);

io.of('/').on('connection', socket => {
    // Build an array to send back with the img and endpoint for each NS
    let nsData = namespaces.map(ns => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    });
    // console.log(nsData);
    // Send the nsData back to the client. We need to use socket, NOT io, because we want it to
    // go to just this client.
    socket.emit('nsList', nsData);
});

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', nsSocket => {
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
        // a socket has connected to one of our chat group namespaces.
        //send that ns group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms)
    })
});
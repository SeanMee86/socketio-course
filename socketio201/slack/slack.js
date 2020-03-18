const express = require('express');
const app = express();
const socketio = require('socket.io');
let namespaces = require('./data/namespaces');
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
    // Send the nsData back to the client. We need to use socket, NOT io, because we want it to
    // go to just this client.
    socket.emit('nsList', nsData);
});

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', nsSocket => {
        const username = nsSocket.handshake.query.username;
        // a socket has connected to one of our chat group namespaces.
        //send that ns group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms);

        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallBack) => {

            /***** Restrict by number of clients example *****/
            // io.of('/wiki').in(roomToJoin).clients((err, clients) => {
            //     if (clients.length < 2) {
            //         nsSocket.join(roomToJoin);
            //         console.log(`joined Room: ${roomToJoin}`);
            //     } else {
            //         console.log('room is full')
            //     }
            //     numberOfUsersCallBack(clients.length);
            // });

            //deal with history once we have it
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);
            nsSocket.join(roomToJoin);
            io.of(namespace.endpoint).in(roomToJoin).clients((err, clients) => {
                numberOfUsersCallBack(clients.length);
            });
            const nsRoom = namespace.rooms.find(room => {
                return room.roomTitle === roomToJoin
            });
            nsSocket.emit('historyCatchUp', nsRoom.history);
            updateUsersInRoom(namespace, roomToJoin);
        });

        nsSocket.on('newMessageToServer', msg => {
            // console.log(msg);
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username,
                avatar: 'https://via.placeholder.com/30'
            };
            // console.log(msg);
            // console.log(nsSocket.rooms);

            // the user will be in the 2nd room in the object list
            // this is because the socket always joins its own room on connection
            // get the keys
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
        })
    })
});

const updateUsersInRoom = (namespace, roomToJoin) => {
    io.of(namespace.endpoint).in(roomToJoin).clients((err, clients) => {
        // console.log(clients.length);
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    })
};
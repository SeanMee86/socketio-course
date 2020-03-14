function joinNs(endpoint){
    const nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on('nsRoomLoad', nsRooms => {
        // console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';
        nsRooms.forEach(room => {
            let glyph = room.privateRoom ? 'lock' : 'globe';
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        });
        // Add click listener to each room
        let roomNodes = Array.from(document.getElementsByClassName('room'));
        roomNodes.forEach(el => {
            el.addEventListener('click', (e) => {
                console.log(`Someone clicked on ${e.target.innerText}`);
            })
        })
    });
    nsSocket.on('messageToClients', (msg) => {
        console.log(msg);
        document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
    });
    document.querySelector('.message-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        socket.emit('newMessageToServer', {text: newMessage});
    });
}
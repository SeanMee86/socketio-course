function joinNs(endpoint){
    if(nsSocket){
        //check to see if nsSocket is a socket
        nsSocket.close();
        //remove event listener before it's added again
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
    }
    nsSocket = io(`http://localhost:9000${endpoint}`);
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
                joinRoom(e.target.innerText);
            })
        });
        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        // console.log(topRoomName);
        joinRoom(topRoomName);
    });
    nsSocket.on('messageToClients', (msg) => {
        const newMsg = buildHtml(msg);
        document.querySelector('#messages').innerHTML += newMsg
    });
    document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

const formSubmission = (e) => {
    e.preventDefault();
    const messageField = document.querySelector('#user-message');
    const newMessage = messageField.value;
    nsSocket.emit('newMessageToServer', {text: newMessage});
    // messageField.value = '';
}

const buildHtml = (msg) => {
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
        <li>
            <div class="user-image">
                <img src="${msg.avatar}" />
            </div>
            <div class="user-message">
                <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
                <div class="message-text">${msg.text}</div>
            </div>
        </li>
    `
    return newHTML;
};
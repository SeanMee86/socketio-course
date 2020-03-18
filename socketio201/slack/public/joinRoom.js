function joinRoom(roomName) {
    // Send this room name to server
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        //we want to update the room member total now that we have joined
        document.querySelector('.curr-room-num-users').innerHTML = `<span class="glyphicon glyphicon-users">${newNumberOfMembers}</span>`
    });
    nsSocket.on('historyCatchUp', history => {
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML ='';
        history.forEach(msg => {
            const newMsg = buildHtml(msg);
            const currentMessages = messagesUl.innerHTML;
            messagesUl.innerHTML = currentMessages + newMsg
        });
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    });
    nsSocket.on('updateMembers', numMembers => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}<span class="glyphicon glyphicon-users"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`
    });

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (e) => {
        console.log(e.target.value);
        let messages = Array.from(document.getElementsByClassName('message-text'));
        messages.forEach(msg => {
            if (msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
                // the msg does not contain the user search term!
                msg.style.display = 'none';
            }else {
                msg.style.direction = 'block';
            }
        })
    })
}
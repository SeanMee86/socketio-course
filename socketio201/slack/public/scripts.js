const socket = io('http://localhost:9000');

console.log(socket.io);
socket.on('connect', () => {
    console.log(socket.id);
});

// listen for nsList, which is a list of all the namespaces.
socket.on('nsList', nsData => {
    console.log('the list of namespaces has arrived');
    // console.log(nsData);
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>`
    });
    Array.from(document.getElementsByClassName('namespace')).forEach(el => {
        el.addEventListener('click', (e) => {
            const nsEndpoint = el.getAttribute('ns');
        })
    })
});

socket.on('messageFromServer', dataFromServer => {
    console.log(dataFromServer.data);
    socket.emit('dataToServer', {data: "Data from client!"})
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('newMessageToServer', {text: newMessage});
});

socket.on('messageToClients', (msg) => {
    console.log(msg);
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
})

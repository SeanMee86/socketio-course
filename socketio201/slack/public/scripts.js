const socket = io('http://localhost:9000');
let nsSocket = '';

// listen for nsList, which is a list of all the namespaces.
socket.on('nsList', nsData => {
    // console.log('the list of namespaces has arrived');
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
    });
    joinNs('/wiki');
});

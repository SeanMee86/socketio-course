const http = require('http');

const websocket = require('ws');

const server = http.createServer((req, res) => {
    res.end("I am connected");
});

const wss = new websocket.Server({server});

wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        wss.clients.forEach(client => {
            if(client !== ws && client.readyState === websocket.OPEN) {
                client.send(msg)
            }
        })
    })
});

server.listen(8000);



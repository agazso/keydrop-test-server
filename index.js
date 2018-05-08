const WebSocket = require('ws');

const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });
const clients = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log(new Date().toString(), 'received: ', JSON.stringify(data, null, 2));
    const message = JSON.parse(data);

    clients[message.sender] = ws;
    if (clients.hasOwnProperty(message.recipient)) {
        clients[message.recipient].send(data);
    }
  });
  ws.on('close', function close(e) {
    for (key in clients) {
        const client = clients[key];
        if (client == ws) {
            console.log('closed %s', key);
            delete clients[key];
            break;
        }
    }
  });
});

const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
server.listen(5000, () => {
  console.log(`Server is ruuning on port ${5000}`);
});

const clients = {};
const users = {};
let messages = []

const typesDef = {
  MESSAGE_SEND: 'messagesend',
  USER_EVENT: 'userevent',
  CONTENT_CHANGE: 'contentchange'
}

function broadcastMessage(json) {
  const data = JSON.stringify(json);
  for (let userId in clients) {
    let client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  };
}

function handleMessage(message, userId) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === typesDef.USER_EVENT) {
    users[userId] = dataFromClient;
    json.data = { users, messages, userId };
  } else if (dataFromClient.type === typesDef.MESSAGE_SEND) {
    const newMessage = {
      content: dataFromClient.content,
      user: {
        username: users[userId].username,
      },
      date: new Date(),
    };
    messages.push(newMessage);
    json.data = {messages,userId };
  }
  broadcastMessage(json);
}

function handleDisconnect(userId) {
  const json = { type: typesDef.USER_EVENT };
  json.data = { users,  messages };
  delete clients[userId];
  delete users[userId];
  broadcastMessage(json);
}

wsServer.on('connection', function (connection) {
  const userId = uuidv4();
  clients[userId] = connection;
  connection.on('message', (message) => handleMessage(message, userId));
  connection.on('close', () => handleDisconnect(userId));
});

// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const { port } = require('./config');
const express = require("express");
const WebSocket = require('ws');
const app = express();
const wss = new WebSocket.Server({ port: 8080 });

// our default array of messages
const messages = [
  "first message load from server"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of messages to the webpage
app.get("/messages", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(messages);
});

app.post("/message", (request, response) => {
  // express helps us take JS objects and send them as JSON
  console.log('post received: %s', request.body);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(request.body));
    }
  });
  response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

wss.on('connection', function connection(ws) {
  console.log('connected');

  ws.on('message', function incoming(message) {
    console.log('socket received: %s', message);
  });

  ws.send('socket connected');
});
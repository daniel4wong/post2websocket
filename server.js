// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const { port } = require('./config');
const http = require('http');
const express = require("express");
const ws = require('ws');

const app = express();

// we need to create our own http server so express and ws can share it.
const server = http.createServer(app);
//const wss = { on: function(name, func){}, send: function(message){}, clients: [] };

// pass the created server to ws
const wss = new ws.Server({ server: server });

// we're using an ES2015 Set to keep track of every client that's connected
let sockets = new Set();

// based on https://www.npmjs.com/package/ws#simple-server
wss.on('connection', function connection(ws) {
  sockets.add(ws);
  console.log('connected');

  ws.on('message', function incoming(message) {
    console.log('socket received: %s', message);
  });

  ws.on('close', function () {
    sockets.delete(ws);
  });

  ws.send('socket connected');
});

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
  response.json(["first message load from server"]);
});

app.post("/message", (request, response) => {
  // express helps us take JS objects and send them as JSON
  console.log('post received: %s', request.body);
  wss.clients.forEach(function each(client) {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(request.body));
    }
  });
  response.sendStatus(200);
});

// listen for requests :)
const listener = server.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
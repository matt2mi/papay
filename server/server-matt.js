const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// api classique
const app = express();

app.use(express.static('dist/papay'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.get('/yop', (req, res) => res.send({messae: 'yop'}));
app.post('/double', (req, res) => res.send({result: req.body.num * 2}));

const server = app.listen(3000, () => {
  console.log(`Api on port 3000`);
});


// socket.io
const io = require("socket.io")(server);

io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('new-player', name => {
    console.log('create', name);
  });
});

io.on('disconnection', () => {
  console.log('User disconnected');
});

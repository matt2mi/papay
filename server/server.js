const playersService = require('./services/players.service');
const cardsService = require('./services/cards.service');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static('dist/papay'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.post('/create', (req, res) => {
  if (playersService.isExistingPlayerName(req.body.name)) {
    res.status(400);
    res.send({message: 'Nom déjà pris, déso !'});
  } else {
    res.send(playersService.createPlayer(req.body.name));
  }
});
app.get('/getDeck', (req, res) => res.send(cardsService.setDealedDecksToPlayers()));

app.listen(3000, () => console.log(`Example app listening on port 3000!`));

// Session exemple
const session = require('./gamingSession');

session.createPlayers();

session.sample4PlayersSession();
session.sample4PlayersSession();
session.sample4PlayersSession();
session.sample4PlayersSession();

session.displayScores();



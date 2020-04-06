const playersService = require('./services/players.service');
const cardsService = require('./services/cards.service');
const chatService = require('./services/chat.service');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

let partyStarted = false;

// API
// =============================================================================
const app = express();
app.use(express.static('dist/papay'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

const startParty = () => {
  partyStarted = true;
  cardsService.setDealedDecksToPlayers();
  io.emit('partyStarted', true);
};

app.get('/startParty', (req, res) => {
  startParty();
});
app.get('/getDeck/:name', (req, res) => res.send(cardsService.setDealedDecksToPlayers()));

app.get('/players', (req, res) => res.send({players: playersService.getPlayers()}));

app.get('/chatMessages', (req, res) => res.send({messages: chatService.getMessages()}));
app.post('/newChatMessage', (req, res) => {
  chatService.addMessage(req.body.message, io);
  res.send({ok: true});
});

const server = app.listen(3000, () => {
  console.log(`Api on port 3000`);
});

// WEBSOCKETS
// =============================================================================

const io = require("socket.io")(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('createPlayer', name => {
    // TODO: cleaner ?
    if(partyStarted) {
      socket.emit('creatingPlayer', {error: true, message: 'partie déjà démarrée'});
    } else {
      try {
        playersService.createPlayer(socket, name, io);
        socket.emit('creatingPlayer', {error: false, name});
        if(playersService.getNbPlayers() === 8) {
          startParty();
        }
      } catch (error) {
        socket.emit('creatingPlayer', {error: true, message: error.message});
      }
    }
  });

  socket.on('disconnect', function () {
    playersService.removePlayer(socket);
    io.emit('newPlayer', playersService.getPlayers());
  });
});

// // Session exemple
// const session = require('./gamingSession');

// session.createPlayers();

// session.sample4PlayersSession();
// session.sample4PlayersSession();
// session.sample4PlayersSession();
// session.sample4PlayersSession();

// session.displayScores();

// TODO Gestion d'un ordre définitif des joueurs (random au début de partie) (cas ou le premier à jouer une carte est le 3e dans le tableau)
// TODO fin du pli: trouver le perdant, lui ajouter les cartes du pli, changer l'ordre des joueurs pour qu'il joue en premier
// TODO pouvoir dernier pli

/*
Suite des actions Websocket
1 - arrivée sur page login: connexion websocket

2 - attente du nom du joueur

3 - ajout du joueur à la liste (nom + session websocket unique)
  => playersService.createPlayer()

4 - notifier le joueur avec son id (= sa position dans le tableau players) et la liste des joueurs présents en attente d'une partie
  => playersService.getPlayers()

5 - attente nb joueurs max (8) ou démarrer partie

6 - notifier tous du début de la partie (envoi des decks à chaque joueur + envoi ordre joueurs pour savoir à qui on donne les cartes)
  => cardsService.setDealedDecksToPlayers()

7 - attente de toutes les cartes passées au suivant (notifier tous qui n'a pas encore choisi ses cartes à donner)
  => playersService.handleGivenCards() & cardsService.set40Family()

8 - notifier chaque joueur des cartes qu'il a reçu de son voisin et de la famille dont le 7 vaudra 40 (renvoi le nouveau deck entier avec card {... newOne: true}
  => cardsService.get40Family()

9 - notifier les joueurs un par un (en suivant l'ordre et commençant par dernier perdant) pour qu'ils jouent chacun leur tour
  // TODO back.gérerOrdre()

10 - attendre leur réponse (leur carte)

11 - fin du pli: notifier tous du perdant
  => playersService.endRound()

(répéter 9, 10 et 11 jusqu'à fin des cartes des joueurs)

12 - envoi à tous du score de la manche (doit être égal 250)
  => cardsService.countScore()
  // TODO gérer roundScore ds front

(Répéter 6, 7, 8, 9 et 10 jusqu'à nb tours === nb joueurs)

12 - Game over, notif tous des scores, podium
  => // TODO gérer globalScore dans front

13 - attente restart (tous les joueurs doivent cliquer sur restart et notifier tous de qui a fait restart)
 */

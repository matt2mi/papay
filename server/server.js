const playersService = require('./services/players.service');
const cardsService = require('./services/cards.service');
const chatService = require('./services/chat.service');
const playingService = require('./services/playing.service');

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

app.get('/startParty', (req, res) => {
  if (!partyStarted) {
    partyStarted = true;
    playingService.startParty(io);
    res.status(200).send({error: false, message: 'ok'});
  } else {
    res.status(403).send({error: true, message: 'bug: partie déjà started'});
  }
});

app.get('/getDeck/:name', (req, res) => {
  const player = playersService.getPlayerByName(req.params.name);
  if(player) {
    res.send({deck: player.deck});
  } else {
    res.status(403).send({message: 'pseudo de joueur introuvable.'});
  }
});

app.post('/giveCards', (req, res) => {
  // endpoint pour donner ses cartes à son voisin avant le tour
  const player = playersService.getPlayerByName(req.body.name);
  if (player) {
    playersService.handleGivenCardsOneByOne({cards: req.body.cards, player: player});
    if (playersService.hasEveryPlayerGivenCards()) {
      // si tout le monde a donné ses cartes
      try {
        cardsService.set40Family();
        // on renvoit les nouveaux decks à chacun des joueurs
        playersService.sendDecks(cardsService.get40Family());

        // on démarre la partie en avertissant le premier joueur que c'est son tour
        const nextPlayer = playingService.setFirstPlayerToPlay();
        io.emit('nextPlayerTurn', {playerNameWaitedToPlay: nextPlayer.name, cardsPlayedWithPlayer: []});
        playingService.emitPlayerTurn(nextPlayer.name);
      } catch (e) {
        console.error(e);
      }
    }
    res.status(200).send();
  } else {
    res.status(403).send({message: 'pseudo de joueur introuvable.'});
  }
});

app.post('/playCard', (req, res) => {
  playingService.receivePlayerCard(req.body.playerName, req.body.card, io);
  res.send({ok: true}); // ballec :p
});

app.get('/goNextTour/:name', (req, res) => {
  playingService.unWaitPlayer(req.params.name, io);
  res.send(true);
});

app.get('/players', (req, res) => res.send(playersService.getPlayers()));

app.get('/chatMessages', (req, res) => res.send({messages: chatService.getMessages()}));

app.post('/newChatMessage', (req, res) => {
  chatService.addMessage(req.body.message, io);
  res.send({ok: true});
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Api on port ${port}`);
});

// WEBSOCKETS
// =============================================================================
const io = require("socket.io")(server);

const resetServer = () => {
  playersService.reset();
  playingService.reset();
  chatService.reset();
  partyStarted = false;
};

io.on('connection', (socket) => {
  socket.on('createPlayer', name => {
    // TODO: cleaner ?
    if(partyStarted) {
      socket.emit('creatingPlayer', {name: '', error: {value: true, message: 'partie déjà démarrée'}});
    } else {
      try {
        playersService.createPlayer(socket, name, io);
        console.log('New user connected', name);
        socket.emit('creatingPlayer', {name, error: {value: false, message: ''}});
        if(playersService.getNbPlayers() === 8) {
          playingService.startParty(io);
        }
      } catch (error) {
        socket.emit('creatingPlayer', {name, error: {value: true, message: error.message}});
      }
    }
  });

  socket.on('disconnect', function () {
    if (partyStarted) {
      const playerDisconnected = playersService.getPlayerBySocketId(socket.id);
      console.log('disconnected', playerDisconnected.name);
      io.emit('playerDisconnected', playerDisconnected.name);
      resetServer();
    } else {
      playersService.removePlayer(socket);
      io.emit('newPlayer', playersService.getPlayers());
    }
  });
});

// TODO : bon nb cartes à donner
// TODO : dernière carte du pli (cacher cartes du deck le temps de voir le pli)
// TODO : bug sur l'enchainement - trop vite ?
// TODO : possible spectateur ? (juste pli visible et chat)

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

10 - attendre leur réponse (leur carte)

11 - fin du pli: notifier tous du perdant
  => playersService.endRound()

(répéter 9, 10 et 11 jusqu'à fin des cartes des joueurs)

12 - envoi à tous du score de la manche (doit être égal 250)
  => cardsService.countScore()

(Répéter 6, 7, 8, 9 et 10 jusqu'à nb tours === nb joueurs)

12 - Game over, notif tous des scores, podium

13 - attente restart (tous les joueurs doivent cliquer sur restart et notifier tous de qui a fait restart)
 */

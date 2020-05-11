const playersService = require('./services/players.service');
const cardsService = require('./services/cards.service');
const chatService = require('./services/chat.service');
const playingService = require('./services/playing.service');
const logsService = require('./services/logs.service');

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
  logsService.logs('get /startParty', partyStarted);
  if (!partyStarted) {
    try {
      playingService.startParty(io);
    } catch (e) {
      console.error(e);
    }
    partyStarted = true;
    res.status(200).send({error: false, message: 'ok'});
  } else {
    res.status(403).send({error: true, message: 'bug: partie déjà commencée'});
  }
});

const noPartyStarted = res => {
  res.status(403).send({error: true, message: 'bug: pas de partie en cours'});
};

app.get('/getDeck/:name', (req, res) => {
  if (partyStarted) {
    const player = playersService.getPlayerByName(req.params.name);
    if (player) {
      logsService.logs('get /getDeck/' + req.params.name, player.name);
      res.send({deck: player.deck});
    } else {
      logsService.logs('get /getDeck/' + req.params.name, 'pseudo de joueur introuvable.');
      res.status(403).send({message: 'pseudo de joueur introuvable.'});
    }
  } else {
    noPartyStarted(res);
  }
});

app.post('/giveCards', (req, res) => {
  if (partyStarted) {
    // endpoint pour donner ses cartes à son voisin avant le tour
    const player = playersService.getPlayerByName(req.body.name);
    if (player) {
      playingService.unWaitGivingCardsPlayer(player.name, io);
      logsService.logs('post /giveCards ' + player.name, req.body.cards);
      try {
        playersService.handleGivenCardsOneByOne({cards: req.body.cards, player: player});
      } catch (e) {
        console.error(e);
      }
      if (playersService.hasEveryPlayerGivenCards()) {
        // si tout le monde a donné ses cartes
        try {
          cardsService.set40Family();
          // on renvoit les nouveaux decks à chacun des joueurs
          playersService.sendDecks(cardsService.get40Family());

          // on démarre la partie en avertissant le premier joueur que c'est son tour
          const nextPlayer = playingService.setFirstPlayerToPlay();
          logsService.logs('post /giveCards - on démarre la partie', nextPlayer.name);
          playingService.emitNextPlayerTurn(io, nextPlayer.name);
        } catch (e) {
          console.error(e);
        }
      }
      res.status(200).send();
    } else {
      logsService.logs('post /giveCards ' + req.body.name, 'pseudo de joueur introuvable.');
      res.status(403).send({message: 'pseudo de joueur introuvable.'});
    }
  } else {
    noPartyStarted(res);
  }
});

app.post('/playCard', (req, res) => {
  if (partyStarted) {
    logsService.logs('post /playCard ' + req.body.playerName, req.body.cards);
    try {
      playingService.receivePlayerCard(req.body.playerName, req.body.card, io);
    } catch (e) {
      console.error(e);
    }
    res.send({ok: true});
  } else {
    noPartyStarted(res);
  }
});

app.get('/goNextTour/:name', (req, res) => {
  if (partyStarted) {
    logsService.logs('get /goNextTour/' + req.params.name);
    playingService.unWaitPlayerForNewTour(req.params.name, io);
    res.send(true);
  } else {
    noPartyStarted(res);
  }
});

app.get('/players', (req, res) => {
  logsService.logs('get /players', playersService.getPlayers().map(player => player.name));
  res.send(playersService.getPlayers());
});

app.post('/deletePlayer', (req, res) => {
  logsService.logs('post /deletePlayer ' + req.body.kickedName + ' ' + req.body.kickerName);
  if (!partyStarted) {
    try {
      playersService.removePlayerByName(req.body.kickedName, req.body.kickerName);
      const message = req.body.kickedName + ' a été kické.';
      console.log(message);
      res.send({message});
    } catch (error) {
      console.error(error);
      res.status(404).send({error});
    }
  } else {
    const error = 'Partie déjà commencée';
    console.error(error);
    res.status(403).send({error});
  }
});

app.get('/chatMessages', (req, res) => {
  logsService.logs('get /chatMessages', chatService.getMessages());
  res.send(chatService.getMessages());
});

app.post('/newChatMessage', (req, res) => {
  logsService.logs('post /newChatMessage', req.body);
  chatService.addMessage(req.body.message, req.body.color, io);
  res.send(true);
});

app.post('/checkAnswer', (req, res) => {
  logsService.logs('post /checkAnswer', req.body.answer);
  if (req.body.answer === 'c\'est gagné') {
    res.send({message: 'BRAVO t\'as gagné le quizz de confi !!!', error: false});
  } else {
    res.send({message: 'nope.', error: true});
  }
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
    if (partyStarted) {
      logsService.logs('socket.emit(creatingPlayer) - Désolé ' + name + ', partie déjà démarrée :/');
      socket.emit('creatingPlayer', {
        name: '',
        color: '',
        error: {value: true, message: 'Désolé ' + name + ', partie déjà démarrée :/'}
      });
    } else {
      try {
        const newPlayer = playersService.createPlayer(socket, name, io);
        logsService.logs('socket.emit(creatingPlayer) - New user connected: ' + newPlayer.name + ', color: ' + newPlayer.color);
        socket.emit('creatingPlayer', {
          name: newPlayer.name,
          color: newPlayer.color,
          error: {value: false, message: ''}
        });
        if (playersService.getNbPlayers() === 8) {
          logsService.logs('nb max player => playingService.startParty');
          playingService.startParty(io);
        }
      } catch (error) {
        logsService.logs('socket.emit(creatingPlayer) - ', error.message);
        socket.emit('creatingPlayer', {name, color: '', error: {value: true, message: error.message}});
      }
    }
  });

  socket.on('disconnect', function () {
    if (partyStarted) {
      const playerDisconnected = playersService.getPlayerBySocketId(socket.id);
      if (playerDisconnected) {
        logsService.logs('io.emit(\'playerDisconnected\')', playerDisconnected.name);
        io.emit('playerDisconnected', playerDisconnected.name);
        resetServer();
      } else {
        console.error('socket.on(\'disconnect\') - playerDisconnected introuvable');
      }
    } else {
      playersService.removePlayerBySocketId(socket.id);
      logsService.logs('socket.on(\'disconnect\') - io.emit(\'newPlayer\'', playersService.getPlayers().map(pl => pl.name));
      io.emit('newPlayer', playersService.getPlayers());
    }
  });
});

// Bugs :
// TODO : déconnexion au bout d'un certain temps ?? (demander confirmation ? chercher dans la doc socketio ?)
// TODO : bug du à mauvaise utilisation socketio ? (utiliser websocket ? plu simple ?) (des fois des emit en double/triple !!)

// Evols :
// TODO : ajouter du son:
// pour un nouveau message ds le chat
// pour jouer la musique de Carlos Papayou (activée par défaut)
// pour la distribution des cartes
// pour jouer une carte
// pour récupérer le pli (rire d'andy chez celui qui prend le 7 à 40 pts)
// pour wizzer quelqu'un trop lent
// TODO : icone son et/ou music on/off musique
// TODO : ajouter des gifs ? pour le 7 à 40 pts
// TODO : au login, proposer au joueur d'ajouter une image (url ou fichier / base64) (stockée localStorage ?)
// TODO : afficher l'image à côté de son nom / mettre des images aléatoires moches pour ceux qui n'ont pas d'images

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

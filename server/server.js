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

// TODO gestion du dé du choix du 7 à '0 points
// TODO Gestion d'un ordre définitif des joueurs (ordre d'arrivée ?) (cas ou le premier à jouer une carte est le 3e dans le tableau)
// TODO fin du pli: trouver le perdant, lui ajouter les cartes du pli, changer l'ordre des joueurs pour qu'il joue en premier
// TODO enlever les 1 pour 7 et 8 joueurs
// TODO avoir un petit chat (comme skribble.io)
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
  => cardsService.handleGivenCards()

8 - notifier chaque joueur des cartes qu'il a reçu de son voisin (renvoi le nouveau deck entier avec card {... newOne: true}

// TODO Dé du 7

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

const playersService = require('./players.service');
const cardsService = require('./cards.service');
const logsService = require('./logs.service');
const Player = require('../models/player');

// un tour = tous les plis entre deux distribution de cartes
// un pli = round = une carte jouée par joueur

let firstPlayerToPlay; // le joueur qui entame le tour
let playedCardsOfRound = []; // cartes d'un pli [{card: Card, player: Player}, ... ]
let startingPlayerOfRound; // le joueur qui joue une carte en premier sur ce pli (perdant du pli précédent)
let nbCardsPlayedInTour = 0; // nombre de carte jouées dans le tour => identifier la fin du tour
let nbTour = 1; // le nombre de tour joué depuis le début => game over quand nbTour === nbPlayers

const startParty = io => {
  playersService.setWaitedPlayers();
  cardsService.setDealedDecksToPlayers();
  logsService.logs('playingService.startParty', playersService.getPlayers().map(pl => pl.name));
  io.emit('partyStarted', true);
};

const emitNextPlayerTurn = (io, playerNameWaitedToPlay) => {
  playersService.getPlayers().forEach(player => {
    const playerSocket = playersService.getPlayerSocketByName(player.name);
    if (player.name === playerNameWaitedToPlay) {
      logsService.logs('playerSocket.emit(yourTurn)',
        playedCardsOfRound.map(c => '' + c.card.number + '-' + c.card.family.label));
      playerSocket.emit('yourTurn', playedCardsOfRound);
    } else {
      logsService.logs('playerSocket.emit(nextPlayerTurn) - ' + playerNameWaitedToPlay,
        playedCardsOfRound.map(c => '' + c.card.number + '-' + c.card.family.label));
      playerSocket.emit('nextPlayerTurn', {playerNameWaitedToPlay, cardsPlayedWithPlayer: playedCardsOfRound});
    }
  });
};

const receivePlayerCard = (playerName, card, io) => {
  logsService.logs('receivePlayerCard');
  nbCardsPlayedInTour++;
  const player = playersService.getPlayerByName(playerName);
  playedCardsOfRound.push({card, player});
  if (playedCardsOfRound.length === playersService.getNbPlayers()) {
    // tous les joueurs ont joué une carte, le pli est complet

    // trouver le perdant
    const looser = findLooser(playedCardsOfRound);

    // lui donner les cartes du pli
    giveCardOfRoundToLooser(looser);
    cardsService.countRoundScore();
    const looserInfo = {looser: playersService.getPlayerByName(looser.name), playedCardsOfRound};
    logsService.logs('io.emit(roundLooser)', looserInfo);
    io.emit('roundLooser', looserInfo);

    setTimeout(() => {
      logsService.logs('fin des 3 secondes d\'affichage du perdant du pli');
      // on laisse l'affichage du perdant du pli pendant 3 secondes
      playedCardsOfRound = [];
      if (nbCardsPlayedInTour === 60) { // TODO: mettre 3 au lieu de 60 pour tester plus vite
        // la dernière carte du tour vient d'être jouée
        playersService.emptyCollectedLoosingCards();
        cardsService.countEndTourScore();
        if (nbTour === playersService.getNbPlayers()) {
          // game over
          logsService.logs('io.emit(\'gameOver\')');
          io.emit('gameOver');
        } else {
          nbTour++;
          // tour suivant
          logsService.logs('io.emit(\'endOfTour\') - tour n°' + nbTour, playersService.getPlayers().map(pl => pl.name));
          io.emit('endOfTour', playersService.getPlayers());
          playersService.reinitPlayersForNextRound();
          nbCardsPlayedInTour = 0;
        }
      } else {
        logsService.logs('emitNextPlayerTurn', looser.name);
        emitNextPlayerTurn(io, looser.name);
      }
    }, 3000);
  } else {
    // pli incomplet => on notifie le joueur suivant
    const nextPlayer = playersService.getNextPlayer(playerName);
    logsService.logs('pli incomplet', nextPlayer.name);
    setStartingPlayerOfRound(nextPlayer);
    emitNextPlayerTurn(io, nextPlayer.name);
  }
};

const findLooser = playedCardsOfRound => {
  // la famille demandée par la première carte du pli
  const askedFamilyId = playedCardsOfRound[0].card.family.id;
  // le perdant parmis tous les joueurs qui ont joué des cartes de cette famille
  const looserAndCard = playedCardsOfRound
    .filter(cardAndPlayer => cardAndPlayer.card.family.id === askedFamilyId)
    .reduce((prev, current) => {
      return (prev.card.number > current.card.number) ? prev : current;
    });
  if (looserAndCard) return looserAndCard.player;
  return null;
};

const giveCardOfRoundToLooser = (looserOfRound) => {
  // les cartes du pli
  const loosingCards = playedCardsOfRound.map(cardAndPlayer => cardAndPlayer.card);
  playersService.addLoosingCards(loosingCards, looserOfRound.name);
  setStartingPlayerOfRound(looserOfRound);
};

const setStartingPlayerOfRound = player => {
  logsService.logs('setStartingPlayerOfRound', player.name);
  startingPlayerOfRound = player;
};

const setFirstPlayerToPlay = () => {
  if (firstPlayerToPlay) {
    // il existe déjà (un tour a déjà été joué) => donc on set le joueur suivant
    firstPlayerToPlay = Player.clonePlayer(playersService.getNextPlayer(firstPlayerToPlay.name));
    logsService.logs('setFirstPlayerToPlay - next', firstPlayerToPlay.name);
  } else {
    // il n'existe pas, c'est le premier tour de jeu, donc le premier de la liste commence
    firstPlayerToPlay = Player.clonePlayer(playersService.getPlayers()[0]);
    logsService.logs('setFirstPlayerToPlay - first of list', firstPlayerToPlay.name);
  }
  return firstPlayerToPlay;
};

const unWaitPlayer = (name, io) => {
  const waitedPlayers = playersService.getWaitedPlayers();
  const id = waitedPlayers.findIndex(player => player.name === name);
  playersService.removeWaitedPlayer(id);
  if (waitedPlayers.length > 0) {
    io.emit('waitedPlayersForNextTour', waitedPlayers);
  } else {
    playersService.setWaitedPlayers();
    cardsService.setDealedDecksToPlayers();
    io.emit('newTour');
  }
};

const reset = () => {
  logsService.logs('playingService.reset');
  firstPlayerToPlay = null;
  playedCardsOfRound = [];
  startingPlayerOfRound = null;
  nbCardsPlayedInTour = 0;
  nbTour = 1;
};

module.exports = {
  startParty,
  emitNextPlayerTurn,
  receivePlayerCard,
  findLooser,
  setFirstPlayerToPlay,
  unWaitPlayer,
  reset
};

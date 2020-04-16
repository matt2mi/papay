const playersService = require('./players.service');
const cardsService = require('./cards.service');
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
  io.emit('partyStarted', true);
};

const emitPlayerTurn = firstPlayerName => {
  const currentPlayerSocket = playersService.getPlayerSocketByName(firstPlayerName);
  currentPlayerSocket.emit('yourTurn', true);
};

const emitNextPlayerTurn = (io, playerNameWaitedToPlay) => {
  io.emit('nextPlayerTurn', {playerNameWaitedToPlay, cardsPlayedWithPlayer: playedCardsOfRound});
  emitPlayerTurn(playerNameWaitedToPlay);
};

const receivePlayerCard = (playerName, card, io) => {
  nbCardsPlayedInTour++;
  const player = playersService.getPlayerByName(playerName);
  playedCardsOfRound.push({card, player});
  if (playedCardsOfRound.length === playersService.getNbPlayers()) {
    // tous les joueurs ont joué une carte, le pli est complet

    // trouver le perdant
    const looser = findLooser(playedCardsOfRound);

    // lui donner les cartes du pli
    giveCardOfRoundToLooser(looser);
    cardsService.countScore();
    io.emit('roundLooser', playersService.getPlayerByName(looser.name));

    if (nbCardsPlayedInTour === 60) { // TODO: mettre 3 au lieu de 60 pour tester plus vite
      // la dernière carte du tour vient d'être jouée
      cardsService.countScore();
      playersService.emptyCollectedLoosingCards();
      if (nbTour === playersService.getNbPlayers()) {
        // game over
        io.emit('gameOver');
      } else {
        nbTour++;
        // tour suivant
        playersService.reinitPlayersForNextRound();
        nbCardsPlayedInTour = 0;
        io.emit('endOfTour', playersService.getPlayers());
      }
    } else {
      emitNextPlayerTurn(io, looser.name);
    }
    playedCardsOfRound = [];
  } else {
    // pli incomplet => on notifie le joueur suivant
    const nextPlayer = playersService.getNextPlayer(playerName);
    setStartingPlayerOfRound(nextPlayer);
    try {
      emitNextPlayerTurn(io, nextPlayer.name);
    } catch (e) {
      throw new Error(e);
    }
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
  return null; // TODO throw new error('erreur findLooser') ?
};

const giveCardOfRoundToLooser = (looserOfRound) => {
  // les cartes du pli
  const loosingCards = playedCardsOfRound.map(cardAndPlayer => cardAndPlayer.card);
  playersService.addLoosingCards(loosingCards, looserOfRound.name);
  setStartingPlayerOfRound(looserOfRound);
};

const setStartingPlayerOfRound = player => {
  startingPlayerOfRound = player;
};

const setFirstPlayerToPlay = () => {
  if (firstPlayerToPlay) {
    // il existe déjà (un tour a déjà été joué) => donc on set le joueur suivant
    firstPlayerToPlay = Player.clonePlayer(playersService.getNextPlayer(firstPlayerToPlay.name));
  } else {
    // il n'existe pas, c'est le premier tour de jeu, donc le premier de la liste commence
    firstPlayerToPlay = Player.clonePlayer(playersService.getPlayers()[0]);
  }
  return firstPlayerToPlay;
};

const unWaitPlayer = (name, io) => {
  const waitedPlayers = playersService.getWaitedPlayers();
  const id = waitedPlayers.findIndex(player => player.name === name);
  playersService.removeWaitedPlayer(id);
  if (waitedPlayers.length > 0) {
    io.emit('waitedPlayersForNextRound', waitedPlayers);
  } else {
    playersService.setWaitedPlayers();
    cardsService.setDealedDecksToPlayers();
    io.emit('newTour');
  }
};

const reset = () => {
  firstPlayerToPlay = null;
  playedCardsOfRound = [];
  startingPlayerOfRound = null;
  nbCardsPlayedInTour = 0;
  nbTour = 1;
};

module.exports = {
  startParty,
  emitPlayerTurn,
  receivePlayerCard,
  findLooser,
  setFirstPlayerToPlay,
  unWaitPlayer,
  reset
};

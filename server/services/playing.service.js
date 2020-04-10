const playersService = require('./players.service');

// un tour = tous les plis entre deux distribution de cartes
// un pli = round = une carte jouée par joueur

let firstPlayerToPlay; // le joueur qui entame le tour
let playedCardsOfRound = []; // cartes d'un pli [{card: Card, player: Player}, ... ]
let startingPlayerOfRound; // le joueur qui joue une carte en premier sur ce pli (perdant du pli précédent)

const emitPlayerTurn = firstPlayerName => {
  const currentPlayerSocket = playersService.getPlayerSocketByName(firstPlayerName);
  currentPlayerSocket.emit('yourTurn', true);
};

const emitNextPlayerTurn = (io, nextPlayerName) => {
  io.emit('nextPlayerTurn', {nextPlayerName, cardsPlayedWithPlayer: playedCardsOfRound});
  emitPlayerTurn(nextPlayerName);
};

const receivePlayerCard = (playerName, card, io) => {
  const player = playersService.getPlayerByName(playerName);
  playedCardsOfRound.push({card, player});
  if (playedCardsOfRound.length === playersService.getNbPlayers()) {
    // tous les joueurs ont joué une carte, le pli est complet

    // trouver le perdant
    const looser = findLooser(playedCardsOfRound);

    io.emit('roundLooser', looser.name);

    // lui donner les cartes du pli
    giveCardOfRoundToLooser(looser, io);
  } else {
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

const giveCardOfRoundToLooser = (looserOfRound, io) => {
  // les cartes du pli
  const loosingCards = playedCardsOfRound.map(cardAndPlayer => cardAndPlayer.card);
  playersService.addLoosingCards(loosingCards, looserOfRound.name);
  setStartingPlayerOfRound(looserOfRound);

  playedCardsOfRound = [];

  // si pas le dernier pli du tour
  emitNextPlayerTurn(io, looserOfRound.name);
  // TODO sinon dernier pli: fin du tour / décompte point / redistribution
};

const setStartingPlayerOfRound = player => {
  startingPlayerOfRound = player;
};

const setFirstPlayerToPlay = player => {
  firstPlayerToPlay = player;
};

module.exports = {
  emitPlayerTurn,
  receivePlayerCard,
  findLooser,
  setFirstPlayerToPlay
};

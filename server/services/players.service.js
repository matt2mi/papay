const Player = require('../models/player');

let players = [];
let playersSockets = [];
let waitedPlayers = []; // les joueurs attendus pour passer au tour suivant

const createPlayer = (socket, name, io) => {
  if (isExistingPlayerName(name)) {
    throw new Error('Pseudo dejà utilisé.');
  } else {
    const newPlayer = new Player(name, null, socket.id);
    players.push(newPlayer);
    playersSockets.push(socket);
    io.emit('newPlayer', players);
  }
};

const getPlayerSocketByName = name => {
  const player = getPlayerByName(name);
  return player ? playersSockets.find(socket => socket.id === player.socketId) : null;
};

const getPlayerBySocketId = socketId => {
  return players.find(player => player.socketId === socketId);
};

const removePlayer = socket => {
  const playerToRemoveId = players.findIndex(player => player.socketId === socket.id);
  if(playerToRemoveId >= 0) {
    players.splice(playerToRemoveId, 1);
  }

  const socketToRemoveId = playersSockets.findIndex(soc => soc.id === socket.id);
  if(socketToRemoveId >= 0) playersSockets.splice(socketToRemoveId, 1);
};

const getPlayers = () => players;

const getNbPlayers = () => players.length;

const getPlayerByName = name => players.find(player => player.name === name);

const setPlayers = newPlayers => players = newPlayers;

const isExistingPlayerName = name => players.some(player => player.name === name);

const setPlayersDecks = decks => {
  players.forEach((player, id) => player.deck = player.deck.concat(decks[id]));
};

const handleGivenCardsOneByOne = cardAndPlayer => {
  const currentPlayer = cardAndPlayer.player;
  const givenCards = cardAndPlayer.cards;
  const currentPlayerId = players.findIndex(player => player.name === currentPlayer.name);
  // ajout cartes au deck du joueur suivant
  if (players[currentPlayerId + 1]) {
    addCardToNextPlayer(currentPlayerId + 1, givenCards);
  } else {
    // le joueur suivant est le premier de la liste
    addCardToNextPlayer(0, givenCards);
  }

  // retrait cartes du deck du joueur
  cardAndPlayer.cards.forEach(cardToRemove => {
    const cardId = players[currentPlayerId].deck.findIndex(card =>
      card.family.id === cardToRemove.family.id && card.number === cardToRemove.number);
    players[currentPlayerId].deck.splice(cardId, 1);
  });

  players[currentPlayerId].hasGivenCards = true;
};

const addCardToNextPlayer = (playerIdToGiveCards, givenCards) => {
  players[playerIdToGiveCards].deck = players[playerIdToGiveCards].deck.concat(givenCards.map(card => ({
    ...card,
    newOne: true,
    toGive: false,
  })));
};

const hasEveryPlayerGivenCards = () => {
  return !players.some(player => !player.hasGivenCards);
};

const sendDecks = family40 => {
  players.forEach(player => {
    const socket = getPlayerSocketByName(player.name);
    if (socket) {
      socket.emit('newDeck', {deck: player.deck, family40});
    } else {
      throw new Error('no socket found');
    }
  });
};

const addLoosingCards = (loosingCards, looserNameOfRound) => {
  const player = getPlayerByName(looserNameOfRound);
  player.collectedLoosingCards = player.collectedLoosingCards.concat(loosingCards);
};

const emptyCollectedLoosingCards = () => {
  players.forEach(player => player.collectedLoosingCards = []);
};

const getNextPlayer = previousPlayerName => {
  const currentPlayerId = players.findIndex(player => player.name === previousPlayerName);
  if (currentPlayerId < 0) {
    throw new Error('nextPlayer introuvable');
  } else if (currentPlayerId === players.length - 1) {
    // cas du dernier de la liste
    return players[0];
  } else {
    return players[currentPlayerId + 1];
  }
};

const getWaitedPlayers = () => {
  return waitedPlayers;
};

const setWaitedPlayers = () => {
  waitedPlayers = [];
  waitedPlayers = waitedPlayers.concat(players);
};

const removeWaitedPlayer = id => waitedPlayers.splice(id, 1);

const reinitPlayersForNextRound = () => {
  players.forEach(player => {
    player.hasGivenCards = false;
    player.deck = [];
  });
};

const reset = () => {
  players = [];
  playersSockets = [];
  waitedPlayers = [];
};

module.exports = {
  createPlayer,
  getPlayerSocketByName,
  getPlayerBySocketId,
  removePlayer,
  getPlayers,
  getNbPlayers,
  getPlayerByName,
  setPlayers,
  setPlayersDecks,
  handleGivenCardsOneByOne,
  hasEveryPlayerGivenCards,
  sendDecks,
  addLoosingCards,
  emptyCollectedLoosingCards,
  getNextPlayer,
  getWaitedPlayers,
  setWaitedPlayers,
  removeWaitedPlayer,
  reinitPlayersForNextRound,
  reset
};

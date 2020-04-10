const Player = require('../models/player');
const utilsService = require('./utils.service');

let players = [];
const playersSockets = [];

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

// cardsGiven: tableau d'objets contenant une liste de cartes données par un joueur et une référence vers ce joueur
// [{cards: Card[], player: Player}, {...}, ...]
const handleGivenCards = cardsGivenByPlayer => {
  // ajout des cartes données par le voisin précédent
  players.forEach((player, id) => {
    if (players[id - 1]) {
      const cardsToAdd = cardsGivenByPlayer.find(c => c.player.name === players[id - 1].name);
      player.deck = player.deck.concat(cardsToAdd.cards.map(card => ({...card, newOne: true})));
    } else {
      const cardsToAdd = cardsGivenByPlayer.find(c => c.player.name === players[players.length - 1].name);
      player.deck = player.deck.concat(cardsToAdd.cards.map(card => ({...card, newOne: true})));
    }
  });

  // suppression des cartes données au voisin suivant
  players.forEach(player => {
    const cardsToRemove = cardsGivenByPlayer.find(c => c.player.name === player.name);
    cardsToRemove.cards.forEach(card => {
      const cardId = utilsService.getIndexOfCard(player.deck, card);
      player.deck.splice(cardId, 1);
    });
  });

  players.forEach(player => utilsService.sortCards(player.deck));

  return players;
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

module.exports = {
  createPlayer,
  getPlayerSocketByName,
  removePlayer,
  getPlayers,
  getNbPlayers,
  getPlayerByName,
  setPlayers,
  setPlayersDecks,
  handleGivenCardsOneByOne,
  hasEveryPlayerGivenCards,
  handleGivenCards,
  sendDecks,
  addLoosingCards,
  getNextPlayer
};

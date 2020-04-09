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
    console.log(players[playerToRemoveId].name + ' removed');
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

// cardAndPlayer: {cards: Card[], player: Player}
const handleGivenCardsOneByOne = cardAndPlayer => {
  const currentPplayer = cardAndPlayer.player;
  const currPlaId = players.findIndex(player => player.name === currentPplayer.name);
  // ajout cartes au deck du joueur suivant
  if (players[currPlaId + 1]) {
    players[currPlaId + 1].deck = players[currPlaId + 1].deck.concat(cardAndPlayer.cards.map(card => ({
      ...card,
      newOne: true
    })));
  } else {
    // le joueur suivant est le premier de la liste
    players[0].deck = players[0].deck.concat(cardAndPlayer.cards.map(card => ({...card, newOne: true})));
  }

  // retrait cartes du deck du joueur
  cardAndPlayer.cards.forEach(cardToRemove => {
    const cardId = players[currPlaId].deck.findIndex(card =>
      card.family.id === cardToRemove.family.id && card.number === cardToRemove.number);
    players[currPlaId].deck.splice(cardId, 1);
  });

  players[currPlaId].hasGivenCards = true;
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

const endRound = (looserName, cardPlayedByPlayer) => {
  const looser = getPlayerByName(looserName);

  // ajout des cartes du pli au perdant
  const cardsPlayed = cardPlayedByPlayer.map(cardAndPlayer => cardAndPlayer.card);
  looser.collectedLoosingCards = looser.collectedLoosingCards.concat(cardsPlayed);

  // retrait des cartes jouées des decks des joueurs
  cardPlayedByPlayer.forEach(cardAndPlayer => {
    const player = getPlayerByName(cardAndPlayer.player.name);
    const cardId = utilsService.getIndexOfCard(player.deck, cardAndPlayer.card);
    player.deck.splice(cardId, 1);
  });

  return looser;
};

module.exports = {
  createPlayer,
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
  endRound
};

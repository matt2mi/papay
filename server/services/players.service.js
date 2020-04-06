const Player = require('../models/player');
const utilsService = require('./utils.service');

// TODO: seulement playersMap ?
let players = [];
let playersMap = new Map();

const createPlayer = (socket, name, io) => {
  if (isExistingPlayerName(name)) {
    throw new Error('Pseudo dejà utilisé.');
  } else {
    const newPlayer = new Player(name);
    players.push(newPlayer);
    playersMap.set(socket, newPlayer);
    io.emit('newPlayer', players);
  }
};

const removePlayer = socket => {
  const nameDisconnected = playersMap.get(socket).name;
  const idToDelete = players.findIndex(player => player.name === nameDisconnected);
  players.splice(idToDelete, 1);
  playersMap.delete(socket);
};

const getPlayers = () => players;

const getNbPlayers = () => players.length;

const getPlayerByName = name => players.find(player => player.name === name);

const setPlayers = newPlayers => players = newPlayers;

const isExistingPlayerName = name => players.some(player => player.name === name);

const setPlayersDecks = decks => {
  players.forEach((player, id) => player.deck = player.deck.concat(decks[id]));
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
  isExistingPlayerName,
  setPlayersDecks,
  handleGivenCards,
  endRound
};

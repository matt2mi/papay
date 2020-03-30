const Player = require('../models/player');
const utilsService = require('./utils.service');

let players = [];

const createPlayer = name => {
  const newPlayer = new Player(name);
  players.push(newPlayer);
  return newPlayer;
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
  getPlayers,
  getNbPlayers,
  setPlayers,
  isExistingPlayerName,
  setPlayersDecks,
  handleGivenCards,
  endRound
};

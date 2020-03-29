const Player = require('../models/player');
const utilsService = require('./utils.service');

let players = [];

const getPlayers = () => players;
const getPlayerByName = name => players.find(player => player.name === name);
const setPlayers = newPlayers => players = newPlayers;

const isExistingPlayerName = name => players.some(player => player.name === name);

const createPlayer = name => {
  const newPlayer = new Player(name);
  players.push(newPlayer);
  return newPlayer;
};

const endRound = (looserName, cardPlayedByPlayer) => {
  const looser = players.find(player => player.name === looserName);

  // ajout des cartes du pli au perdant
  const cardsPlayed = cardPlayedByPlayer.map(cardAndPlayer => cardAndPlayer.card);
  looser.collectedLoosingCards = looser.collectedLoosingCards.concat(cardsPlayed);

  // retrait des cartes jouées des decks des joueurs
  cardPlayedByPlayer.forEach(cardAndPlayer => {
    const player = players.find(player => player.name === cardAndPlayer.player.name); // TODO use getPlayerByName()
    const cardId = utilsService.getIndexOfCard(player.deck, cardAndPlayer.card);
    player.deck.splice(cardId, 1);
  });

  return players;
};

module.exports = {
  getPlayers,
  isExistingPlayerName,
  getPlayerByName,
  setPlayers,
  createPlayer,
  endRound
};

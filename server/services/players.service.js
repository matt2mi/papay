const Player = require('../models/player');

let players = [];
const createPlayer = name => {
  const newPlayer = new Player(name);
  players.push(newPlayer);
  return newPlayer;
};
const getPlayers = () => players;

module.exports = {
  getPlayers,
  createPlayer
};

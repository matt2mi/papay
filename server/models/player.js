class Player {
  name = '';
  deck = [];
  socketId = '';
  collectedLoosingCards = [];
  roundScore = 0;
  globalScore = 0;
  hasGivenCards = false;
  static clonePlayer = player => {
    const newPlayer = new Player();

    newPlayer.name = player.name;
    newPlayer.deck = player.deck;
    newPlayer.socketId = player.socketId;
    newPlayer.collectedLoosingCards = player.collectedLoosingCards;
    newPlayer.roundScore = player.roundScore;
    newPlayer.globalScore = player.globalScore;
    newPlayer.hasGivenCards = player.hasGivenCards;
    newPlayer.color = player.color;

    return newPlayer;
  };
  color = '';

  constructor(name, deck, socketId, color) {
    this.name = name;
    this.deck = deck ? deck : [];
    this.socketId = socketId ? socketId : '';
    this.color = color ? color : '';
  }
}

module.exports = Player;

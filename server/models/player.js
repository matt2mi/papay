class Player {
  name = '';
  deck = [];
  socketId = '';
  collectedLoosingCards = [];
  roundScore = 0;
  globalScore = 0;
  hasGivenCards = false;

  constructor(name, deck, socketId) {
    this.name = name;
    this.deck = deck ? deck : [];
    this.socketId = socketId ? socketId : '';
  }

  static clonePlayer = player => {
    const newPlayer = new Player();

    newPlayer.name = player.name;
    newPlayer.deck = player.deck;
    newPlayer.socketId = player.socketId;
    newPlayer.collectedLoosingCards = player.collectedLoosingCards;
    newPlayer.roundScore = player.roundScore;
    newPlayer.globalScore = player.globalScore;
    newPlayer.hasGivenCards = player.hasGivenCards;

    return newPlayer;
  };
}

module.exports = Player;

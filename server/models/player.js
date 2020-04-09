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
}

module.exports = Player;

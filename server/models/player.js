class Player {
  name = '';
  deck = [];
  collectedLoosingCards = [];
  roundScore = 0;
  globalScore = 0;

  constructor(name, deck) {
    this.name = name;
    this.deck = deck ? deck : [];
  }
}

module.exports = Player;

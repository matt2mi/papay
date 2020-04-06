class Player {
  name = '';
  deck = [];
  collectedLoosingCards = [];
  roundScore = 0;
  globalScore = 0;
  hasGivenCards = false;

  constructor(name, deck) {
    this.name = name;
    this.deck = deck ? deck : [];
  }
}

module.exports = Player;

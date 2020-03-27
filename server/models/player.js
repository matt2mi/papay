class Player {
  name = '';
  deck = [];
  collectedLoosingCards = [];
  score = 0;

  constructor(name, deck) {
    this.name = name;
    this.deck = deck ? deck : [];
  }
}

module.exports = Player;

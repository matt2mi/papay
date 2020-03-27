class Player {
  name = '';
  deck = [];
  collectedLoosingCards = [];

  constructor(name, deck) {
    this.name = name;
    this.deck = deck ? deck : [];
  }
}

module.exports = Player;

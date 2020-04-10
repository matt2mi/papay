class Card {
  family;
  number;
  newOne = false;

  constructor(family, number, newOne) {
    this.family = family ? family : null;
    this.number = number ? number : null;
    this.newOne = newOne ? newOne : false;
  }
}

module.exports = Card;

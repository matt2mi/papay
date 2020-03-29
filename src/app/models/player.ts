import Card from './card';

export default class Player {
  name: string;
  deck: Card[];
  collectedLoosingCards: Card[];
  score: number;

  constructor(name = '', deck = []) {
    this.name = name;
    this.deck = deck;
    this.collectedLoosingCards = [];
    this.score = 0;
  }
}

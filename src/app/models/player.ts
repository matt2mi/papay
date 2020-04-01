import Card from './card';

export default class Player {
  name: string;
  deck: Card[];
  collectedLoosingCards: Card[];
  roundScore: number;
  globalScore: number;

  constructor(name = '', deck = []) {
    this.name = name;
    this.deck = deck;
    this.collectedLoosingCards = [];
    this.roundScore = 0;
    this.globalScore = 0;
  }
}

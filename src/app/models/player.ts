import Card from './card';

export default class Player {
  name: string;
  deck: Card[];
  collectedLoosingCards: Card[];
  roundScore: number;
  globalScore: number;
  color: string;

  constructor(name = '', deck = [], color = 'red') {
    this.name = name;
    this.deck = deck;
    this.collectedLoosingCards = [];
    this.roundScore = 0;
    this.globalScore = 0;
    this.color = color;
  }
}

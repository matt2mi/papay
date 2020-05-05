import Card from './card';

export default class Player {
  name: string;
  deck: Card[];
  collectedLoosingCards: Card[];
  roundScore: number;
  globalScore: number;
  color: string;
  currentCard: Card;

  constructor(name = '', deck = [], color = 'red', card: Card = null) {
    this.name = name;
    this.deck = deck;
    this.collectedLoosingCards = [];
    this.roundScore = 0;
    this.globalScore = 0;
    this.color = color;
    this.currentCard = card;
  }
}

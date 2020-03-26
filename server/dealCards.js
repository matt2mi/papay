const Families = require('./families');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const papayooNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const createPlayersDecks = () => {
  const cards = createGlobalDeck();
  shuffleCards(cards);
  const playersDecks = dealCards(cards);
  playersDecks.forEach(deck => sortCards(deck));
  return playersDecks;
};

const createGlobalDeck = () => {
  const cards = [];
  for (let family of Object.keys(Families)) {
    if (family === 'PAPAYOO') {
      for (let papayooNumber of papayooNumbers) {
        cards.push({family: Families[family], number: papayooNumber});
      }
    } else {
      for (let number of numbers) {
        cards.push({family: Families[family], number});
      }
    }
  }
  return cards;
};

const shuffleCards = cards => {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
};

const dealCards = cards => {
  // 3 players - toutes les cartes - 6x3 + 1x2
  const deck1 = [], deck2 = [], deck3 = [];

  for (let i = 0; i < cards.length; i = i + 3) {
    deck1.push(cards[i]);
    deck2.push(cards[i + 1]);
    deck3.push(cards[i + 2]);
  }

  return [deck1, deck2, deck3];
};

const sortCards = deck => {
  deck.sort((c1, c2) => c1.number - c2.number);
  deck.sort((c1, c2) => c1.family.id - c2.family.id);
};

module.exports = createPlayersDecks;

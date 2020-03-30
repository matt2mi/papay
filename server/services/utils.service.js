const isSameCards = (cardA, cardB) => cardA.family.id === cardB.family.id && cardA.number === cardB.number;
const getIndexOfCard = (deck, cardToFind) => {
  let cardIndex = -1;
  deck.forEach((card, index) => {
    if (isSameCards(card, cardToFind)) cardIndex = index;
  });
  return cardIndex;
};

const sortCards = deck => {
  deck.sort((c1, c2) => c1.number - c2.number);
  deck.sort((c1, c2) => c1.family.id - c2.family.id);
};

module.exports = {
  getIndexOfCard,
  sortCards
};

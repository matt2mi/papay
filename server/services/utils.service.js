const isSameCards = (cardA, cardB) => cardA.family.id === cardB.family.id && cardA.number === cardB.number;
const getIndexOfCard = (deck, cardToFind) => {
  let cardIndex = -1;
  deck.forEach((card, index) => {
    if (isSameCards(card, cardToFind)) cardIndex = index;
  });
  return cardIndex;
};

module.exports = {
  getIndexOfCard
};

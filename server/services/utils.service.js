
const sortCards = deck => {
  deck.sort((c1, c2) => c1.number - c2.number);
  deck.sort((c1, c2) => c1.family.id - c2.family.id);
};

module.exports = {
  sortCards
};

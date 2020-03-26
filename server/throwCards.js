const isSameCards = (cardA, cardB) => cardA.family.id === cardB.family.id && cardA.number === cardB.number;
const getIndexOfCard = (deck, cardToFind) => {
  let cardIndex = -1;
  deck.forEach((card, index) => {
    if (isSameCards(card, cardToFind)) cardIndex = index;
  });
  return cardIndex;
};

const throwCards = (decks, ...plAtoPlB) => {
  const newDecks = [].concat(decks);

  // ajout des cartes données par le voisin précédent
  for (let i = 0; i < plAtoPlB.length; i++) {
    if (newDecks[i + 1]) {
      newDecks[i + 1] = newDecks[i + 1].concat(plAtoPlB[i]);
    } else {
      // cas du dernier donneur qui donne au premier de la liste
      newDecks[0] = newDecks[0].concat(plAtoPlB[i]);
    }
  }

  // suppression des cartes données au voisin suivant
  for (let i = 0; i < plAtoPlB.length; i++) {
    for (let j = 0; j < plAtoPlB[i].length; j++) {
      const cardId = getIndexOfCard(newDecks[i], plAtoPlB[i][j]);
      newDecks[i].splice(cardId, 1);
    }
  }

  return newDecks;
};

module.exports = throwCards;

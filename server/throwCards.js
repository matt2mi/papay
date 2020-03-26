const throwCards = (decks, ...plAtoPlB) => {
  // plAtoPlB.forEach(changingCards => {
  for (let i = 0; i < plAtoPlB.length; i++) {
    const changingCards = plAtoPlB[i];
    for (let card of changingCards) {
      const id = decks[i].indexOf(card);

      // add id to pl2Deck
      if (i === plAtoPlB.length - 1) {
        decks[0].push(decks[i][id]);
      } else {
        decks[i + 1].push(decks[i][id]);
      }

      // rm id from pl1Deck
      decks[i].splice(id, 1);
    }
  }
  // });
};

module.exports = throwCards;

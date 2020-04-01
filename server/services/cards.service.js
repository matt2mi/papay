const playersService = require('./players.service');
const utilsService = require('./utils.service');
const Families = require('../models/families');

const numbersForLessThan7Players = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const numbersFor7or8Players = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const papayooNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
let family40;

const createPlayersDecks = () => {
  const nbPlayers = playersService.getNbPlayers();
  const cards = createGlobalDeck(nbPlayers < 7 ? numbersForLessThan7Players : numbersFor7or8Players);
  shuffleCards(cards);
  const playersDecks = dealCards(cards, nbPlayers);
  playersDecks.forEach(deck => utilsService.sortCards(deck));
  return playersDecks;
};

const createGlobalDeck = numbers => {
  const cards = [];
  for (let family of Object.keys(Families)) {
    if (family === 'PAPAYOO') {
      for (let papayooNumber of papayooNumbers) {
        cards.push({family: Families[family], number: papayooNumber, newOne: false});
      }
    } else {
      for (let number of numbers) {
        cards.push({family: Families[family], number, newOne: false});
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

const dealCards = (cards, nbPlayers) => {
  const decks = [];

  for (let i = 0; i < nbPlayers; i++) {
    decks.push([]);
  }

  for (let i = 0; i < cards.length; i = i + nbPlayers) {
    for (let j = 0; j < nbPlayers; j++) {
      decks[j].push(cards[i + j]);
    }
  }

  return decks;
};

const setDealedDecksToPlayers = () => {
  const playersDecks = createPlayersDecks();
  playersService.setPlayersDecks(playersDecks);
};

const countScore = family => {
  playersService.getPlayers().forEach(player => {
    let score = 0;
    player.collectedLoosingCards.forEach(card => {
      if (card.family.label === 'Papayoo') score += card.number;
      if (card.family.label === family.label && card.number === 7) return score += 40;
    });
    player.roundScore = score;
    player.globalScore += score;
    player.collectedLoosingCards = [];
  });
};

const get40Family = () => family40;

const set40Family = () => family40 = Families[Math.floor(Math.random() * 4)];

module.exports = {
  setDealedDecksToPlayers,
  countScore,
  get40Family,
  set40Family
};

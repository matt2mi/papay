const playersService = require('./players.service');
const Families = require('../models/families');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const papayooNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const createPlayersDecks = (nbPlayers) => {
  const cards = createGlobalDeck(nbPlayers);
  shuffleCards(cards);
  const playersDecks = dealCards(cards, nbPlayers);
  playersDecks.forEach(deck => sortCards(deck));
  return playersDecks;
};
const createGlobalDeck = () => {
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
  // 3 players - toutes les cartes - 6x3 + 1x2
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
const sortCards = deck => {
  deck.sort((c1, c2) => c1.number - c2.number);
  deck.sort((c1, c2) => c1.family.id - c2.family.id);
};

const setDealedDecksToPlayers = () => {
  const myPlayers = playersService.getPlayers();
  const playersDecks = createPlayersDecks(myPlayers.length);
  myPlayers.forEach((player, id) => player.deck = player.deck.concat(playersDecks[id]));
};


const isSameCards = (cardA, cardB) => cardA.family.id === cardB.family.id && cardA.number === cardB.number;
const getIndexOfCard = (deck, cardToFind) => {
  let cardIndex = -1;
  deck.forEach((card, index) => {
    if (isSameCards(card, cardToFind)) cardIndex = index;
  });
  return cardIndex;
};

const throwCards = (players, playerAtoPlayerB) => {
  // ajout des cartes données par le voisin précédent
  for (let i = 0; i < playerAtoPlayerB.length; i++) {
    if (players[i + 1]) {
      players[i + 1].deck =
        players[i + 1].deck.concat(playerAtoPlayerB[i].map(card => ({...card, newOne: true})));
    } else {
      // cas du dernier donneur qui donne au premier de la liste
      players[0].deck = players[0].deck.concat(playerAtoPlayerB[i].map(card => ({...card, newOne: true})));
    }
  }

  // suppression des cartes données au voisin suivant
  for (let i = 0; i < playerAtoPlayerB.length; i++) {
    for (let j = 0; j < playerAtoPlayerB[i].length; j++) {
      const cardId = getIndexOfCard(players[i].deck, playerAtoPlayerB[i][j]);
      players[i].deck.splice(cardId, 1);
    }
  }

  players.forEach(player => sortCards(player.deck));
  return players;
};

module.exports = {
  setDealedDecksToPlayers,
  throwCards
};

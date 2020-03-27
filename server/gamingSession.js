const playersService = require('./services/players.service');
const cardsService = require('./services/cards.service');

const sample4PlayersSession = () => {
// Première phase - ajout joueurs
  playersService.createPlayer('matt');
  playersService.createPlayer('mimi');
  playersService.createPlayer('gu');
  playersService.createPlayer('cle');

// Deuxième phase - distribution
  cardsService.setDealedDecksToPlayers();

// Troisième phase - joueurs échangent leurs mauvaises cartes
  const pl1ToPl2 = [
    playersService.getPlayers()[0].deck[0],
    playersService.getPlayers()[0].deck[1],
    playersService.getPlayers()[0].deck[2],
    playersService.getPlayers()[0].deck[3],
    playersService.getPlayers()[0].deck[4]
  ];
  const pl2ToPl3 = [
    playersService.getPlayers()[1].deck[0],
    playersService.getPlayers()[1].deck[1],
    playersService.getPlayers()[1].deck[2],
    playersService.getPlayers()[1].deck[3],
    playersService.getPlayers()[1].deck[4]
  ];
  const pl3ToPl4 = [
    playersService.getPlayers()[2].deck[0],
    playersService.getPlayers()[2].deck[1],
    playersService.getPlayers()[2].deck[2],
    playersService.getPlayers()[2].deck[3],
    playersService.getPlayers()[2].deck[4]
  ];
  const pl4ToPl1 = [
    playersService.getPlayers()[3].deck[0],
    playersService.getPlayers()[3].deck[1],
    playersService.getPlayers()[3].deck[2],
    playersService.getPlayers()[3].deck[3],
    playersService.getPlayers()[3].deck[4]
  ];
  const playersReady = cardsService.throwCards(playersService.getPlayers(), [pl1ToPl2, pl2ToPl3, pl3ToPl4, pl4ToPl1]);
  playersReady.forEach(player => console.log(player.name, player.deck));

// Quatrième phase - tours de jeu
roundService.endRound(looserName, cards);
roundService.endRound(looserName, cards);
roundService.endRound(looserName, cards);
roundService.endRound(looserName, cards);
roundService.endRound(looserName, cards);
// TODO...
};

module.exports = { sample4PlayersSession };

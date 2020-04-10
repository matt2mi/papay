const playersService = require('./services/players.service');
const cardsService = require('./services/cards.service');

let nbTour = 1;

const createPlayers = () => {
  playersService.createPlayer('matt');
  playersService.createPlayer('mimi');
  playersService.createPlayer('gu');
  playersService.createPlayer('cle');
};

const sample4PlayersSession = () => {
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
  const playersReady = playersService.handleGivenCards([
    {cards: pl1ToPl2, player: playersService.getPlayers()[0]},
    {cards: pl2ToPl3, player: playersService.getPlayers()[1]},
    {cards: pl3ToPl4, player: playersService.getPlayers()[2]},
    {cards: pl4ToPl1, player: playersService.getPlayers()[3]}
  ]);

  cardsService.set40Family();

// Quatrième phase - tours de jeu
  for (let i = 0; i < 15; i++) {
    const cardPlayedByPlayer = [];
    // pour test - tout le monde joue sa première carte
    // le fonctionnement de savoir qui joue en premier (et qui perd le tour) sera géré au retour des client websocket pour
    // fournir ici directement le nom du perdant et la liste des cartes qu'il récupert
    cardPlayedByPlayer.push({player: playersReady[0], card: playersReady[0].deck[0]});
    cardPlayedByPlayer.push({player: playersReady[1], card: playersReady[1].deck[0]});
    cardPlayedByPlayer.push({player: playersReady[2], card: playersReady[2].deck[0]});
    cardPlayedByPlayer.push({player: playersReady[3], card: playersReady[3].deck[0]});

    const looserNme = i % 2 === 0 ? 'cle' : 'matt';
    playersService.addLoosingCards(looserNme, cardPlayedByPlayer);
  }

// Cinquième phase - décompte points
  cardsService.countScore();

  console.log('------- tour ', nbTour);
  nbTour++;
  playersService
    .getPlayers()
    .sort((pl1, pl2) => pl1.roundScore - pl2.roundScore)
    .forEach(player => console.log(player.name + ' ' + player.roundScore));
};

const displayScores = () => {
  console.log('-------- Game Over ----------');
  // Fin - affichage scores
  playersService
    .getPlayers()
    .sort((pl1, pl2) => pl1.globalScore - pl2.globalScore)
    .forEach(player => console.log(player.name + ' ' + player.globalScore));
};

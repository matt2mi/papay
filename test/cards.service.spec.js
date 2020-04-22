const Player = require('../server/models/player');
const cardsService = require('../server/services/cards.service');
const playersService = require('../server/services/players.service');
const expect = require('chai').expect;

describe('cardsService', function () {
  it('should count only papayoo\'s values', function () {
    const player = new Player('nom', []);
    player.collectedLoosingCards = [
      {family: {id: 1, label: 'Coeur'}, number: 2},
      {family: {id: 1, label: 'Coeur'}, number: 2},
      {family: {id: 4, label: 'Papayoo'}, number: 2},
      {family: {id: 4, label: 'Papayoo'}, number: 4}
    ];
    playersService.setPlayers([player]);
    cardsService.set40Family();

    cardsService.countRoundScore();

    expect(playersService.getPlayers()[0].roundScore).to.equal(6);
  });

  it('should count papayoo\'s values and the 40 pts 7', function () {
    const player = new Player('nom', []);
    player.collectedLoosingCards = [
      {family: {id: 1, label: 'Coeur'}, number: 2},
      {family: {id: 0, label: 'Pique'}, number: 7},
      {family: {id: 1, label: 'Coeur'}, number: 7},
      {family: {id: 2, label: 'Carreau'}, number: 7},
      {family: {id: 3, label: 'Trefle'}, number: 7},
      {family: {id: 4, label: 'Papayoo'}, number: 2},
      {family: {id: 4, label: 'Papayoo'}, number: 4}
    ];
    playersService.setPlayers([player]);
    cardsService.set40Family();

    cardsService.countRoundScore();

    expect(playersService.getPlayers()[0].roundScore).to.equal(46);
  });
});

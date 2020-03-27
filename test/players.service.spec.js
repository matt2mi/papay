const Player = require('../server/models/player');
const expect = require('chai').expect;

describe('playersService', function () {
  it('should create players', function () {
    const playersService = require('../server/services/players.service');
    playersService.createPlayer('player1');
    playersService.createPlayer('player2');

    expect(playersService.getPlayers().length).to.equal(2);
    expect(playersService.getPlayers()[0].name).to.equal('player1');
    expect(playersService.getPlayers()[1].name).to.equal('player2');
  });

  it('should end a play round', function () {
    const playersService = require('../server/services/players.service');
    playersService.setPlayers([
      new Player('player1', [{family: {id: 1, label: 'Coeur'}, number: 2, newOne: true}]),
      new Player('player2', [{family: {id: 1, label: 'Coeur'}, number: 4, newOne: true}])
    ]);
    const roundCards = [
      {player: playersService.getPlayers()[0], card: {family: {id: 1, label: 'Coeur'}, number: 2, newOne: true}},
      {player: playersService.getPlayers()[1], card: {family: {id: 1, label: 'Coeur'}, number: 4, newOne: true}}
    ];

    playersService.endRound('player1', roundCards);

    expect(playersService.getPlayers().length).to.equal(2);
    expect(playersService.getPlayers()[0].collectedLoosingCards.length).to.equal(2);

    expect(playersService.getPlayers()[0].collectedLoosingCards[0].family.label).to.equal('Coeur');
    expect(playersService.getPlayers()[0].collectedLoosingCards[0].number).to.equal(2);
    expect(playersService.getPlayers()[0].collectedLoosingCards[0].newOne).to.be.true;

    expect(playersService.getPlayers()[0].collectedLoosingCards[1].family.label).to.equal('Coeur');
    expect(playersService.getPlayers()[0].collectedLoosingCards[1].number).to.equal(4);
    expect(playersService.getPlayers()[0].collectedLoosingCards[1].newOne).to.be.true;

    expect(playersService.getPlayers()[0].deck.length).to.equal(0);
    expect(playersService.getPlayers()[1].deck.length).to.equal(0);
  });
});

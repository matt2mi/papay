const playingService = require('../server/services/playing.service');
const Card = require('../server/models/card');
const Families = require('../server/models/families');
const Player = require('../server/models/player');
const expect = require('chai').expect;

describe('PlayingService', function () {
  it('should get looser when all cards are same family', function () {
    const playedCardRound = [
      {card: new Card(Families.SPADES, 1), player: new Player('player1')},
      {card: new Card(Families.SPADES, 10), player: new Player('player2')},
      {card: new Card(Families.SPADES, 9), player: new Player('player3')}
    ];

    const looser = playingService.findLooser(playedCardRound);

    expect(looser.name).to.equal('player2');
  });

  it('should get looser when cards are not same family', function () {
    const playedCardRound = [
      {card: new Card(Families.SPADES, 1), player: new Player('player1')},
      {card: new Card(Families.CHAMROCK, 10), player: new Player('player2')},
      {card: new Card(Families.PAPAYOO, 20), player: new Player('player3')}
    ];

    const looser = playingService.findLooser(playedCardRound);

    expect(looser.name).to.equal('player1');
  });

  it('should get looser when cards are not same family', function () {
    const playedCardRound = [
      {card: new Card(Families.SPADES, 1), player: new Player('player1')},
      {card: new Card(Families.CHAMROCK, 10), player: new Player('player2')},
      {card: new Card(Families.PAPAYOO, 20), player: new Player('player3')},
      {card: new Card(Families.SPADES, 2), player: new Player('player4')}
    ];

    const looser = playingService.findLooser(playedCardRound);

    expect(looser.name).to.equal('player4');
  });
});

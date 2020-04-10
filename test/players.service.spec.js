const playersService = require('../server/services/players.service');
const Player = require('../server/models/player');
const Card = require('../server/models/card');
const Families = require('../server/models/families');
const expect = require('chai').expect;

describe('playersService', function () {
  it('should create players', function () {
    playersService.setPlayers([]);
    playersService.createPlayer({id: 'socket1'}, 'player1', {
      emit: () => {
      }
    });
    playersService.createPlayer({id: 'socket2'}, 'player2', {
      emit: () => {
      }
    });

    expect(playersService.getPlayers().length).to.equal(2);
    expect(playersService.getPlayers()[0].name).to.equal('player1');
    expect(playersService.getPlayers()[1].name).to.equal('player2');
  });

  it('should end a play round', function () {
    const card1 = new Card(Families[0], 2, true);
    const player1 = new Player('player1', [card1]);

    const card2 = new Card(Families[0], 4, false);
    const player2 = new Player('player2', [card2]);

    playersService.setPlayers([player1, player2]);
    const roundCards = [card1, card2];

    playersService.addLoosingCards(roundCards, 'player1');

    expect(playersService.getPlayers().length).to.equal(2);
    expect(playersService.getPlayers()[0].collectedLoosingCards.length).to.equal(2);
    expect(playersService.getPlayers()[0].collectedLoosingCards[0]).to.equal(card1);
    expect(playersService.getPlayers()[0].collectedLoosingCards[1]).to.equal(card2);
  });

  it('should get next player to play', function () {
    const player1 = new Player('player1');
    const player2 = new Player('player2');
    const player3 = new Player('player3');

    playersService.setPlayers([player1, player2, player3]);

    let nextOne = playersService.getNextPlayer(player1.name);
    expect(nextOne.name).to.equal(player2.name);

    nextOne = playersService.getNextPlayer(player3.name);
    expect(nextOne.name).to.equal(player1.name);
  });

  describe('handleGivenCards', function () {
    const players = [
      new Player('player1', [
        {family: {id: 0, label: 'Pique'}, number: 1},
        {family: {id: 0, label: 'Pique'}, number: 3},
        {family: {id: 0, label: 'Pique'}, number: 5},
        {family: {id: 0, label: 'Pique'}, number: 6},
        {family: {id: 1, label: 'Coeur'}, number: 2},
        {family: {id: 2, label: 'Carreau'}, number: 2},
        {family: {id: 2, label: 'Carreau'}, number: 6},
        {family: {id: 2, label: 'Carreau'}, number: 7},
        {family: {id: 2, label: 'Carreau'}, number: 9},
        {family: {id: 3, label: 'Trefle'}, number: 5},
        {family: {id: 3, label: 'Trefle'}, number: 6},
        {family: {id: 4, label: 'Papayoo'}, number: 3},
        {family: {id: 4, label: 'Papayoo'}, number: 4},
        {family: {id: 4, label: 'Papayoo'}, number: 5},
        {family: {id: 4, label: 'Papayoo'}, number: 6},
        {family: {id: 4, label: 'Papayoo'}, number: 7},
        {family: {id: 4, label: 'Papayoo'}, number: 8},
        {family: {id: 4, label: 'Papayoo'}, number: 11},
        {family: {id: 4, label: 'Papayoo'}, number: 15},
        {family: {id: 4, label: 'Papayoo'}, number: 20}
      ]),
      new Player('player2', [
        {family: {id: 0, label: 'Pique'}, number: 9},
        {family: {id: 0, label: 'Pique'}, number: 10},
        {family: {id: 1, label: 'Coeur'}, number: 3},
        {family: {id: 1, label: 'Coeur'}, number: 8},
        {family: {id: 1, label: 'Coeur'}, number: 10},
        {family: {id: 2, label: 'Carreau'}, number: 3},
        {family: {id: 2, label: 'Carreau'}, number: 4},
        {family: {id: 2, label: 'Carreau'}, number: 8},
        {family: {id: 3, label: 'Trefle'}, number: 1},
        {family: {id: 3, label: 'Trefle'}, number: 3},
        {family: {id: 3, label: 'Trefle'}, number: 7},
        {family: {id: 3, label: 'Trefle'}, number: 8},
        {family: {id: 3, label: 'Trefle'}, number: 9},
        {family: {id: 4, label: 'Papayoo'}, number: 1},
        {family: {id: 4, label: 'Papayoo'}, number: 9},
        {family: {id: 4, label: 'Papayoo'}, number: 10},
        {family: {id: 4, label: 'Papayoo'}, number: 12},
        {family: {id: 4, label: 'Papayoo'}, number: 13},
        {family: {id: 4, label: 'Papayoo'}, number: 16},
        {family: {id: 4, label: 'Papayoo'}, number: 18}
      ]),
      new Player('player3', [
        {family: {id: 0, label: 'Pique'}, number: 2},
        {family: {id: 0, label: 'Pique'}, number: 4},
        {family: {id: 0, label: 'Pique'}, number: 7},
        {family: {id: 0, label: 'Pique'}, number: 8},
        {family: {id: 1, label: 'Coeur'}, number: 1},
        {family: {id: 1, label: 'Coeur'}, number: 4},
        {family: {id: 1, label: 'Coeur'}, number: 5},
        {family: {id: 1, label: 'Coeur'}, number: 6},
        {family: {id: 1, label: 'Coeur'}, number: 7},
        {family: {id: 1, label: 'Coeur'}, number: 9},
        {family: {id: 2, label: 'Carreau'}, number: 1},
        {family: {id: 2, label: 'Carreau'}, number: 5},
        {family: {id: 2, label: 'Carreau'}, number: 10},
        {family: {id: 3, label: 'Trefle'}, number: 2},
        {family: {id: 3, label: 'Trefle'}, number: 4},
        {family: {id: 3, label: 'Trefle'}, number: 10},
        {family: {id: 4, label: 'Papayoo'}, number: 2},
        {family: {id: 4, label: 'Papayoo'}, number: 14},
        {family: {id: 4, label: 'Papayoo'}, number: 17},
        {family: {id: 4, label: 'Papayoo'}, number: 19}
      ])
    ];
    const pl1ToPl2 = [
      {family: {id: 1, label: 'Coeur'}, number: 2, newOne: false},
      {family: {id: 2, label: 'Carreau'}, number: 7, newOne: false},
      {family: {id: 2, label: 'Carreau'}, number: 9, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 5, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 6, newOne: false}
    ];
    const pl2ToPl3 = [
      {family: {id: 0, label: 'Pique'}, number: 9, newOne: false},
      {family: {id: 0, label: 'Pique'}, number: 10, newOne: false},
      {family: {id: 1, label: 'Coeur'}, number: 3, newOne: false},
      {family: {id: 1, label: 'Coeur'}, number: 8, newOne: false},
      {family: {id: 1, label: 'Coeur'}, number: 10, newOne: false}
    ];
    const pl3ToPl1 = [
      {family: {id: 2, label: 'Carreau'}, number: 10, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 10, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 14, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 17, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 19, newOne: false}
    ];
    let expectedPlayers;

    before(() => {
      playersService.setPlayers(players);
      playersService.handleGivenCardsOneByOne({cards: pl2ToPl3, player: players[1]});
      playersService.handleGivenCardsOneByOne({cards: pl3ToPl1, player: players[2]});
      playersService.handleGivenCardsOneByOne({cards: pl1ToPl2, player: players[0]});
      expectedPlayers = playersService.getPlayers();
    });

    after(() => playersService.setPlayers([]));

    describe('each players should receive five cards from his previous neighbor deck', function () {
      it('pl1 should get the 5 cards of pl3', function () {
        const expectedPlayer1Deck = expectedPlayers[0].deck;
        console.log('expectedPlayer1Deck', expectedPlayer1Deck);
        expect(expectedPlayer1Deck).to.deep.include({...pl3ToPl1[0], newOne: true, toGive: false});
        expect(expectedPlayer1Deck).to.deep.include({...pl3ToPl1[1], newOne: true, toGive: false});
        expect(expectedPlayer1Deck).to.deep.include({...pl3ToPl1[2], newOne: true, toGive: false});
        expect(expectedPlayer1Deck).to.deep.include({...pl3ToPl1[3], newOne: true, toGive: false});
        expect(expectedPlayer1Deck).to.deep.include({...pl3ToPl1[4], newOne: true, toGive: false});
      });

      it('pl2 should get the 5 cards of pl1', function () {
        const expectedPlayer2Deck = expectedPlayers[1].deck;

        expect(expectedPlayer2Deck).to.deep.include({...pl1ToPl2[0], newOne: true, toGive: false});
        expect(expectedPlayer2Deck).to.deep.include({...pl1ToPl2[1], newOne: true, toGive: false});
        expect(expectedPlayer2Deck).to.deep.include({...pl1ToPl2[2], newOne: true, toGive: false});
        expect(expectedPlayer2Deck).to.deep.include({...pl1ToPl2[3], newOne: true, toGive: false});
        expect(expectedPlayer2Deck).to.deep.include({...pl1ToPl2[4], newOne: true, toGive: false});
      });

      it('pl3 should get the 5 cards of pl2', function () {
        const expectedPlayer3Deck = expectedPlayers[2].deck;

        expect(expectedPlayer3Deck).to.deep.include({...pl2ToPl3[0], newOne: true, toGive: false});
        expect(expectedPlayer3Deck).to.deep.include({...pl2ToPl3[1], newOne: true, toGive: false});
        expect(expectedPlayer3Deck).to.deep.include({...pl2ToPl3[2], newOne: true, toGive: false});
        expect(expectedPlayer3Deck).to.deep.include({...pl2ToPl3[3], newOne: true, toGive: false});
        expect(expectedPlayer3Deck).to.deep.include({...pl2ToPl3[4], newOne: true, toGive: false});
      });
    });

    describe('each players should loose the five cards he gave to his neighbor', function () {
      it('pl1 should loose his 5 cards', function () {
        const pl1DeckExpected = expectedPlayers[0].deck;

        expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[0]);
        expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[1]);
        expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[2]);
        expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[3]);
        expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[4]);
      });

      it('pl2 should loose his 5 cards', function () {
        const pl2DeckExpected = expectedPlayers[1].deck;

        expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[0]);
        expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[1]);
        expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[2]);
        expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[3]);
        expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[4]);
      });

      it('pl3 should loose his 5 cards', function () {
        const pl3DeckExpected = expectedPlayers[2].deck;

        expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[0]);
        expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[1]);
        expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[2]);
        expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[3]);
        expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[4]);
      });
    });
  });
});

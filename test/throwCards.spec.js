const throwCards = require('../server/throwCards');
const expect = require('chai').expect;

describe('throwCards - 3 players', function () {
  const playersDecks = [
    [
      {family: {id: 0, label: 'Pique'}, number: 1},
      {family: {id: 0, label: 'Pique'}, number: 3},
      {family: {id: 0, label: 'Pique'}, number: 5},
      {family: {id: 0, label: 'Pique'}, number: 6},
      {family: {id: 1, label: 'Coeur'}, number: 2},
      {family: {id: 2, label: 'Carreau'}, number: 2},
      {family: {id: 2, label: 'Carreau'}, number: 6},
      {family: {id: 2, label: 'Carreau'}, number: 7},
      {family: {id: 2, label: 'Carreau'}, number: 9},
      {family: {id: 3, label: 'Trèfle'}, number: 5},
      {family: {id: 3, label: 'Trèfle'}, number: 6},
      {family: {id: 4, label: 'Papayoo'}, number: 3},
      {family: {id: 4, label: 'Papayoo'}, number: 4},
      {family: {id: 4, label: 'Papayoo'}, number: 5},
      {family: {id: 4, label: 'Papayoo'}, number: 6},
      {family: {id: 4, label: 'Papayoo'}, number: 7},
      {family: {id: 4, label: 'Papayoo'}, number: 8},
      {family: {id: 4, label: 'Papayoo'}, number: 11},
      {family: {id: 4, label: 'Papayoo'}, number: 15},
      {family: {id: 4, label: 'Papayoo'}, number: 20}
    ],
    [
      {family: {id: 0, label: 'Pique'}, number: 9},
      {family: {id: 0, label: 'Pique'}, number: 10},
      {family: {id: 1, label: 'Coeur'}, number: 3},
      {family: {id: 1, label: 'Coeur'}, number: 8},
      {family: {id: 1, label: 'Coeur'}, number: 10},
      {family: {id: 2, label: 'Carreau'}, number: 3},
      {family: {id: 2, label: 'Carreau'}, number: 4},
      {family: {id: 2, label: 'Carreau'}, number: 8},
      {family: {id: 3, label: 'Trèfle'}, number: 1},
      {family: {id: 3, label: 'Trèfle'}, number: 3},
      {family: {id: 3, label: 'Trèfle'}, number: 7},
      {family: {id: 3, label: 'Trèfle'}, number: 8},
      {family: {id: 3, label: 'Trèfle'}, number: 9},
      {family: {id: 4, label: 'Papayoo'}, number: 1},
      {family: {id: 4, label: 'Papayoo'}, number: 9},
      {family: {id: 4, label: 'Papayoo'}, number: 10},
      {family: {id: 4, label: 'Papayoo'}, number: 12},
      {family: {id: 4, label: 'Papayoo'}, number: 13},
      {family: {id: 4, label: 'Papayoo'}, number: 16},
      {family: {id: 4, label: 'Papayoo'}, number: 18}
    ],
    [
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
      {family: {id: 3, label: 'Trèfle'}, number: 2},
      {family: {id: 3, label: 'Trèfle'}, number: 4},
      {family: {id: 3, label: 'Trèfle'}, number: 10},
      {family: {id: 4, label: 'Papayoo'}, number: 2},
      {family: {id: 4, label: 'Papayoo'}, number: 14},
      {family: {id: 4, label: 'Papayoo'}, number: 17},
      {family: {id: 4, label: 'Papayoo'}, number: 19}
    ]
  ];
  const pl1ToPl2 = [
    {family: {id: 1, label: 'Coeur'}, number: 2},
    {family: {id: 2, label: 'Carreau'}, number: 7},
    {family: {id: 2, label: 'Carreau'}, number: 9},
    {family: {id: 3, label: 'Trèfle'}, number: 5},
    {family: {id: 3, label: 'Trèfle'}, number: 6}
  ];
  const pl2ToPl3 = [
    {family: {id: 0, label: 'Pique'}, number: 9},
    {family: {id: 0, label: 'Pique'}, number: 10},
    {family: {id: 1, label: 'Coeur'}, number: 3},
    {family: {id: 1, label: 'Coeur'}, number: 8},
    {family: {id: 1, label: 'Coeur'}, number: 10}
  ];
  const pl3ToPl1 = [
    {family: {id: 2, label: 'Carreau'}, number: 10},
    {family: {id: 3, label: 'Trèfle'}, number: 10},
    {family: {id: 4, label: 'Papayoo'}, number: 14},
    {family: {id: 4, label: 'Papayoo'}, number: 17},
    {family: {id: 4, label: 'Papayoo'}, number: 19}
  ];

  describe('each players should receive five cards from his previous neighbor deck', function () {
    it('pl1 should get the 5 cards of pl3', function () {
      const pl1DeckExpected = throwCards(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1)[0];

      expect(pl1DeckExpected).to.deep.include(pl3ToPl1[0]);
      expect(pl1DeckExpected).to.deep.include(pl3ToPl1[1]);
      expect(pl1DeckExpected).to.deep.include(pl3ToPl1[2]);
      expect(pl1DeckExpected).to.deep.include(pl3ToPl1[3]);
      expect(pl1DeckExpected).to.deep.include(pl3ToPl1[4]);
    });

    it('pl2 should get the 5 cards of pl1', function () {
      const pl2DeckExpected = throwCards(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1)[1];

      expect(pl2DeckExpected).to.deep.include(pl1ToPl2[0]);
      expect(pl2DeckExpected).to.deep.include(pl1ToPl2[1]);
      expect(pl2DeckExpected).to.deep.include(pl1ToPl2[2]);
      expect(pl2DeckExpected).to.deep.include(pl1ToPl2[3]);
      expect(pl2DeckExpected).to.deep.include(pl1ToPl2[4]);
    });

    it('pl3 should get the 5 cards of pl2', function () {
      const pl3DeckExpected = throwCards(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1)[2];

      expect(pl3DeckExpected).to.deep.include(pl2ToPl3[0]);
      expect(pl3DeckExpected).to.deep.include(pl2ToPl3[1]);
      expect(pl3DeckExpected).to.deep.include(pl2ToPl3[2]);
      expect(pl3DeckExpected).to.deep.include(pl2ToPl3[3]);
      expect(pl3DeckExpected).to.deep.include(pl2ToPl3[4]);
    });
  });

  describe('each players should loose the five cards he gave to his neighbor', function () {
    it('pl1 should loose his 5 cards', function () {
      const pl1DeckExpected = throwCards(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1)[0];

      expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[0]);
      expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[1]);
      expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[2]);
      expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[3]);
      expect(pl1DeckExpected).to.not.deep.include(pl1ToPl2[4]);
    });

    it('pl2 should loose his 5 cards', function () {
      const pl2DeckExpected = throwCards(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1)[1];

      expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[0]);
      expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[1]);
      expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[2]);
      expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[3]);
      expect(pl2DeckExpected).to.not.deep.include(pl2ToPl3[4]);
    });

    it('pl3 should loose his 5 cards', function () {
      const pl3DeckExpected = throwCards(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1)[2];

      expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[0]);
      expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[1]);
      expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[2]);
      expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[3]);
      expect(pl3DeckExpected).to.not.deep.include(pl3ToPl1[4]);
    });
  });
});

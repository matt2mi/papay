const throwCards = require('../server/throwCards');
const expect = require('chai').expect;

const playersDecks = [
  [
    {family: {id: 0, label: 'Pique'}, number: 1},
    {family: {id: 0, label: 'Pique'}, number: 3},
    {family: {id: 0, label: 'Pique'}, number: 5},
    {family: {id: 0, label: 'Pique'}, number: 6},
    {family: {id: 1, label: 'Coeur'}, number: 2},
    {family: {id: 2, label: 'Carreau'}, number: 9},
    {family: {id: 2, label: 'Carreau'}, number: 7},
    {family: {id: 2, label: 'Carreau'}, number: 6},
    {family: {id: 2, label: 'Carreau'}, number: 2},
    {family: {id: 3, label: 'Trèfle'}, number: 5},
    {family: {id: 3, label: 'Trèfle'}, number: 6},
    {family: {id: 4, label: 'Papayoo'}, number: 6},
    {family: {id: 4, label: 'Papayoo'}, number: 5},
    {family: {id: 4, label: 'Papayoo'}, number: 4},
    {family: {id: 4, label: 'Papayoo'}, number: 7},
    {family: {id: 4, label: 'Papayoo'}, number: 8},
    {family: {id: 4, label: 'Papayoo'}, number: 3},
    {family: {id: 4, label: 'Papayoo'}, number: 11},
    {family: {id: 4, label: 'Papayoo'}, number: 15},
    {family: {id: 4, label: 'Papayoo'}, number: 20}
  ],
  [
    {family: {id: 0, label: 'Pique'}, number: 10},
    {family: {id: 0, label: 'Pique'}, number: 9},
    {family: {id: 1, label: 'Coeur'}, number: 8},
    {family: {id: 1, label: 'Coeur'}, number: 10},
    {family: {id: 1, label: 'Coeur'}, number: 3},
    {family: {id: 2, label: 'Carreau'}, number: 3},
    {family: {id: 2, label: 'Carreau'}, number: 8},
    {family: {id: 2, label: 'Carreau'}, number: 4},
    {family: {id: 3, label: 'Trèfle'}, number: 7},
    {family: {id: 3, label: 'Trèfle'}, number: 8},
    {family: {id: 3, label: 'Trèfle'}, number: 9},
    {family: {id: 3, label: 'Trèfle'}, number: 3},
    {family: {id: 3, label: 'Trèfle'}, number: 1},
    {family: {id: 4, label: 'Papayoo'}, number: 18},
    {family: {id: 4, label: 'Papayoo'}, number: 1},
    {family: {id: 4, label: 'Papayoo'}, number: 10},
    {family: {id: 4, label: 'Papayoo'}, number: 12},
    {family: {id: 4, label: 'Papayoo'}, number: 13},
    {family: {id: 4, label: 'Papayoo'}, number: 16},
    {family: {id: 4, label: 'Papayoo'}, number: 9}
  ],
  [
    {family: {id: 0, label: 'Pique'}, number: 2},
    {family: {id: 0, label: 'Pique'}, number: 8},
    {family: {id: 0, label: 'Pique'}, number: 4},
    {family: {id: 0, label: 'Pique'}, number: 7},
    {family: {id: 1, label: 'Coeur'}, number: 6},
    {family: {id: 1, label: 'Coeur'}, number: 4},
    {family: {id: 1, label: 'Coeur'}, number: 7},
    {family: {id: 1, label: 'Coeur'}, number: 9},
    {family: {id: 1, label: 'Coeur'}, number: 1},
    {family: {id: 1, label: 'Coeur'}, number: 5},
    {family: {id: 2, label: 'Carreau'}, number: 1},
    {family: {id: 2, label: 'Carreau'}, number: 5},
    {family: {id: 2, label: 'Carreau'}, number: 10},
    {family: {id: 3, label: 'Trèfle'}, number: 4},
    {family: {id: 3, label: 'Trèfle'}, number: 2},
    {family: {id: 3, label: 'Trèfle'}, number: 10},
    {family: {id: 4, label: 'Papayoo'}, number: 2},
    {family: {id: 4, label: 'Papayoo'}, number: 14},
    {family: {id: 4, label: 'Papayoo'}, number: 17},
    {family: {id: 4, label: 'Papayoo'}, number: 19}
  ]
];
const pl1ToPl2 = [
  {family: {id: 0, label: 'Pique'}, number: 1},
  {family: {id: 0, label: 'Pique'}, number: 3},
  {family: {id: 0, label: 'Pique'}, number: 5},
  {family: {id: 0, label: 'Pique'}, number: 6},
  {family: {id: 1, label: 'Coeur'}, number: 2}
];
const pl2ToPl3 = [
  {family: {id: 0, label: 'Pique'}, number: 10},
  {family: {id: 0, label: 'Pique'}, number: 9},
  {family: {id: 1, label: 'Coeur'}, number: 8},
  {family: {id: 1, label: 'Coeur'}, number: 10},
  {family: {id: 1, label: 'Coeur'}, number: 3}
];
const pl3ToPl1 = [
  {family: {id: 0, label: 'Pique'}, number: 2},
  {family: {id: 0, label: 'Pique'}, number: 8},
  {family: {id: 0, label: 'Pique'}, number: 4},
  {family: {id: 0, label: 'Pique'}, number: 7},
  {family: {id: 1, label: 'Coeur'}, number: 6}
];

describe('throwCards', function () {
  it('should throw the cards well :p', function () {
    expect(1).equal(10);
  });
});

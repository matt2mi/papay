// TODO add nb players condition(s)
const playersDecks = require('./dealCards')();

const pl1ToPl2 = [playersDecks[0][0], playersDecks[0][1], playersDecks[0][2], playersDecks[0][3], playersDecks[0][4]];
const pl2ToPl3 = [playersDecks[1][0], playersDecks[1][1], playersDecks[1][2], playersDecks[1][3], playersDecks[1][4]];
const pl3ToPl1 = [playersDecks[2][0], playersDecks[2][1], playersDecks[2][2], playersDecks[2][3], playersDecks[2][4]];

const startingDecks = require('./throwCards')(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1);

module.exports = startingDecks;

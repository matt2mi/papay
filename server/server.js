// TODO règles : https://www.gigamic.com/files/catalog/products/rules/papayo0_rule-fr.pdf

const util = require('util');
const playersDecks = require('./dealCards')();

const pl1ToPl2 = [playersDecks[0][0], playersDecks[0][1], playersDecks[0][2], playersDecks[0][3], playersDecks[0][4]];
const pl2ToPl3 = [playersDecks[1][0], playersDecks[1][1], playersDecks[1][2], playersDecks[1][3], playersDecks[1][4]];
const pl3ToPl1 = [playersDecks[2][0], playersDecks[2][1], playersDecks[2][2], playersDecks[2][3], playersDecks[2][4]];
// TODO : en enlever 5 pr 3 joueurs

console.log('playersDecks', util.inspect(playersDecks, {showHidden: false, depth: null}));
console.log('pl1ToPl2', util.inspect(pl1ToPl2, {showHidden: false, depth: null}));
console.log('pl2ToPl3', util.inspect(pl2ToPl3, {showHidden: false, depth: null}));
console.log('pl3ToPl1', util.inspect(pl3ToPl1, {showHidden: false, depth: null}));

const throwCards = require('./throwCards')(playersDecks, pl1ToPl2, pl2ToPl3, pl3ToPl1);
console.log('oklmzer');

// const express = require('express');
// const path = require('path');
// const app = express();
//
// const port = 3000;
//
// app.use(express.static('dist/papay'));
//
// app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
// // app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
//
// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

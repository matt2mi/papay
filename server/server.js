// TODO règles : https://www.gigamic.com/files/catalog/products/rules/papayo0_rule-fr.pdf

const express = require('express');
const path = require('path');
const app = express();

const port = 3000;

app.use(express.static('dist/papay'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.get('/starting-decks', (req, res) => res.send(require('./getStartingDecks')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

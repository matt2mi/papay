const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static('dist/papay'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.listen(3000, () => console.log(`Example app listening on port 3000!`));

// Session exemple
require('./gamingSession').sample4PlayersSession();


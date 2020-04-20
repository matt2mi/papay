import {Component, OnInit} from '@angular/core';
import Player from '../../models/player';
import Card from '../../models/card';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';
import {CardsService} from 'src/app/services/cards.service';
import {FAMILIES, Family} from '../../models/family';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit {

  isCurrentPlayerTurn = false;
  isTimeToPlay = false;
  showRoundLooserName = false;
  isTimeToGiveCard = false;
  isTimeToGetScores = false;
  isReady = false;

  playerNameWaitedToPlay = '';
  currentPlayer: Player;
  previousPlayer: Player;
  nextPlayer: Player;
  connectedPlayers: Player[];
  family40: Family;
  cardFold: { player: Player, card: Card }[] = [];
  nbCardToGive = 5;
  cardToGiveErrorMessage;
  roundLooserName = '';
  nbRound = 1;
  waitedPlayersForNextRound: Player[] = [];
  leftPlayers: Player[] = [];
  rightPlayers: Player[] = [];

  constructor(public router: Router,
              public playersService: PlayersService,
              public cardsService: CardsService) {
  }

  ngOnInit() {
    // this.testFrontOnly();
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.initDeck();
    this.playersService.getConnectedPlayers().subscribe((players: Player[]) => {
      this.connectedPlayers = players;
      this.setLeftAndRightPlayers();
      this.setNbCardToGive();
    });

    this.cardsService.getDeckWithGivenCards$.subscribe((result: { deck: Card[], family40: Family }) => {
      this.isTimeToGiveCard = false;
      this.currentPlayer.deck = result.deck;
      this.family40 = result.family40;
      this.getBackCards();
      this.setAllCardsClickablesOrNot(false);
      this.isTimeToPlay = true;
    });
    this.playersService.nextPlayerTurn$.subscribe(result => {
      this.playerNameWaitedToPlay = result.playerNameWaitedToPlay;
      if (result.cardsPlayedWithPlayer.length === 0) {
        // wait before end the round
        setTimeout(() => this.nextPlayerTurn(result), 3000);
      } else {
        this.nextPlayerTurn(result);
      }
    });
    this.playersService.roundLooser$.subscribe((result: { looser: Player, playedCardsOfRound: { card: Card, player: Player }[] }) => {
      console.log('result', result);
      this.setAllCardsClickablesOrNot(false);
      this.handleRoundLooser(result.looser, result.playedCardsOfRound);
    });
    this.playersService.endOfTour$.subscribe(players => {
      this.setAllCardsClickablesOrNot(false);
      this.isReady = false;
      this.endTour(players);
    });
    this.playersService.waitedPlayersForNextRound$.subscribe(players => this.waitedPlayersForNextRound = players);
    this.playersService.newTour$.subscribe(() => this.initDeck());
    this.playersService.gameOver$.subscribe(() => this.gameOver(''));
    this.playersService.playerDisconnected$.subscribe((name: string) => this.gameOver(name));
  }

  nextPlayerTurn(data) {
    this.cardFold = data.cardsPlayedWithPlayer;
    if (data.playerNameWaitedToPlay === this.currentPlayer.name) {
      // c'est au tour du joueur de jouer
      this.isCurrentPlayerTurn = true;
      this.canPlayCards();
    } else {
      this.isCurrentPlayerTurn = false;
      this.setAllCardsClickablesOrNot(false);
    }
  }

  testFrontOnly() {
    const deck = [
      {family: {id: 0, label: 'Pique'}, number: 3, newOne: false},
      {family: {id: 0, label: 'Pique'}, number: 6, newOne: false},
      {family: {id: 1, label: 'Coeur'}, number: 6, newOne: false},
      {family: {id: 1, label: 'Coeur'}, number: 7, newOne: false},
      {family: {id: 1, label: 'Coeur'}, number: 10, newOne: false},
      {family: {id: 2, label: 'Carreau'}, number: 1, newOne: false},
      {family: {id: 2, label: 'Carreau'}, number: 3, newOne: false},
      {family: {id: 2, label: 'Carreau'}, number: 7, newOne: false},
      {family: {id: 2, label: 'Carreau'}, number: 8, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 2, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 3, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 8, newOne: false},
      {family: {id: 3, label: 'Trefle'}, number: 9, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 2, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 4, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 6, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 7, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 8, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 13, newOne: false},
      {family: {id: 4, label: 'Papayoo'}, number: 20, newOne: false}
    ];
    this.currentPlayer = new Player('matt', deck);
    this.connectedPlayers = [
      new Player('mimi'),
      new Player('matt'),
      new Player('hugo'),
      new Player('maximedelachavonnery'),
      new Player('gu'),
      new Player('cle'),
      new Player('marion'),
      new Player('melanie'),
    ];
    this.setLeftAndRightPlayers();
    this.setNbCardToGive();
    this.isTimeToGiveCard = true;
    this.setAllCardsClickablesOrNot(true);
    this.family40 = FAMILIES[2];

    for (let i = 0; i < this.connectedPlayers.length; i++) {
      this.cardFold.push({player: this.connectedPlayers[i], card: new Card(i + 2, FAMILIES[2])});
    }

    this.isTimeToPlay = true;
  }

  setLeftAndRightPlayers() {
    const currentPlayerId = this.connectedPlayers.findIndex(pl => pl.name === this.currentPlayer.name);
    if (this.connectedPlayers[currentPlayerId - 1]) {
      this.previousPlayer = this.connectedPlayers[currentPlayerId - 1];
    } else {
      this.previousPlayer = this.connectedPlayers[this.connectedPlayers.length - 1];
    }
    if (this.connectedPlayers[currentPlayerId + 1]) {
      this.nextPlayer = this.connectedPlayers[currentPlayerId + 1];
    } else {
      this.nextPlayer = this.connectedPlayers[0];
    }

    const nbPlayers = this.connectedPlayers.length;
    let leftNb = 0;
    let rightNb = 0;
    if (nbPlayers % 2 === 0) {
      // nb joueurs pairs => 1 de plus à gauche
      leftNb = nbPlayers / 2;
      rightNb = leftNb - 1;
    } else {
      // nb joueurs impairs => même nombre de chaque côté
      leftNb = rightNb = Math.ceil(nbPlayers / 2) - 1;
    }

    for (let i = currentPlayerId - 1; i >= currentPlayerId - leftNb; i--) {
      if (this.connectedPlayers[i]) {
        this.leftPlayers.push(this.connectedPlayers[i]);
      } else {
        const id = (i + (nbPlayers));
        this.leftPlayers.push(this.connectedPlayers[id]);
      }
    }
    this.leftPlayers.reverse();

    for (let i = currentPlayerId + 1; i <= currentPlayerId + rightNb; i++) {
      if (this.connectedPlayers[i]) {
        this.rightPlayers.push(this.connectedPlayers[i]);
      } else {
        const id = (i - (nbPlayers));
        this.rightPlayers.push(this.connectedPlayers[id]);
      }
    }
    this.rightPlayers.reverse();
  }

  setNbCardToGive() {
    if (this.connectedPlayers.length < 5) {
      // 3 & 4 joueurs => 5 cartes
      this.nbCardToGive = 5;
    } else if (this.connectedPlayers.length > 5) {
      // 6, 7 et 8 joueurs => 3 cartes
      this.nbCardToGive = 3;
    } else {
      // 5 joueurs => 4 cartes
      this.nbCardToGive = 4;
    }
  }

  initDeck() {
    this.playersService.getCurrentPlayerDeck().subscribe(({deck}) => {
      this.isTimeToGetScores = false;
      this.currentPlayer.deck = deck;
      this.isTimeToGiveCard = true;
      this.setAllCardsClickablesOrNot(true);
    }, error => {
      console.error(error);
    });
  }

  setAllCardsClickablesOrNot(clickability: boolean) {
    this.currentPlayer.deck.forEach(card => card.isPlayable = clickability);
  }

  getBackCards() {
    this.currentPlayer.deck.sort((c1, c2) => c1.number - c2.number);
    this.currentPlayer.deck.sort((c1, c2) => c1.family.id - c2.family.id);
    setTimeout(() => this.currentPlayer.deck.forEach(c => c.newOne = false), 3000);
  }

  getCardToGive() {
    return this.currentPlayer.deck.filter(c => c.toGive);
  }

  clickCard(card: Card) {
    if (card.isPlayable) {
      if (this.isTimeToGiveCard) {
        this.currentPlayer.deck.find(c => c === card).toGive = !card.toGive && this.getCardToGive().length < this.nbCardToGive;
      } else {
        // We are playing
        this.cardsService.playCard(card, this.currentPlayer.name)
          .subscribe(
            () => {
              this.isCurrentPlayerTurn = false;
              const currentCard = this.currentPlayer.deck.find(c => c.family.id === card.family.id && c.number === card.number);
              currentCard.played = true;
            },
            error => console.error('pas joué', error)
          );
      }
    }
  }

  giveCards() {
    if (this.getCardToGive().length !== this.nbCardToGive) {
      this.cardToGiveErrorMessage = `Tu dois donner ${this.nbCardToGive} cartes`;
    } else {
      this.cardsService.giveCard(this.getCardToGive(), this.playersService.getCurrentPlayer().name)
        .subscribe(() => {
          this.isTimeToGiveCard = false;
          this.setAllCardsClickablesOrNot(false);
        });
    }
  }

  handleRoundLooser(roundLooser: Player, playedCardsOfRound: { card: Card, player: Player }[]) {
    this.cardFold = playedCardsOfRound;
    this.isTimeToPlay = false;
    this.showRoundLooserName = true;
    this.updatePlayerRoundScore(roundLooser);
    this.roundLooserName = roundLooser.name;
    setTimeout(
      () => {
        this.isTimeToPlay = true;
        this.showRoundLooserName = false;
        this.nbRound++;
        this.cardFold = [];
        if (this.isCurrentPlayerTurn) {
          this.canPlayCards();
        }
      },
      4000
    );
  }

  updatePlayerRoundScore(roundLooser: Player) {
    const looser = this.connectedPlayers.find(player => player.name === roundLooser.name);
    looser.roundScore = roundLooser.roundScore;
    if (roundLooser.name === this.currentPlayer.name) {
      this.currentPlayer.roundScore = roundLooser.roundScore;
    }
  }

  endTour(players: Player[]) {
    this.connectedPlayers = players;
    this.waitedPlayersForNextRound = players;
    this.isTimeToGetScores = true;
  }

  isCardsInDeckOfFamilyASked() {
    // renvoit true si, dans le deck du joueur, il y a une carte (non jouée) qui est de la famille demandée par la première carte du pli
    return this.currentPlayer.deck
      .filter(card => !card.played)
      .some(card => card.family.id === this.cardFold[0].card.family.id);
  }

  canPlayCards() {
    if (this.cardFold.length !== 0 && this.isCardsInDeckOfFamilyASked()) {
      // cas : au moins une carte de la couleur demandée => seulement cette carte sera jouable
      this.currentPlayer.deck.forEach(card => card.isPlayable = card.family.id === this.cardFold[0].card.family.id);
    } else {
      // cas : le joueur est le premier à jouer OU aucune carte de la couleur demandée
      // => toutes les cartes sont jouables
      this.setAllCardsClickablesOrNot(true);
    }
  }

  readyForNextTour() {
    this.playersService.readyForNextTour().subscribe(() => {
      this.isReady = true;
      this.isCurrentPlayerTurn = false;
      this.playerNameWaitedToPlay = '';
      this.cardFold = [];
      this.isTimeToGiveCard = false;
      this.showRoundLooserName = false;
      this.roundLooserName = '';
      this.nbRound = 1;
      this.family40 = null;
    });
  }

  gameOver(name: string) {
    if (name) {
      alert(name + ' a quitté le jeu...');
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['scores']);
    }
  }

  is40Seven(card: Card): boolean {
    return this.family40 && card.family.id === this.family40.id && card.number === 7;
  }
}

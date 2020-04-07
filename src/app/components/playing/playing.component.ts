import {Component, OnInit} from '@angular/core';
import Player from '../../models/player';
import Card from '../../models/card';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit {

  isCurrentPlayerTurn = false;
  nbRounds = 0;
  currentPlayer: Player;
  connectedPlayers: Player[];
  cardFold: { player: Player, card: Card }[] = [];
  IsGiveCardTime = false;

  constructor(public router: Router, public playersService: PlayersService) {
  }
  
  ngOnInit() {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    // this.playersService.getCurrentPlayerDeck().subscribe(({deck}) => {
    //   this.currentPlayer.deck = deck;
    // }, error => {console.error(error)});

    // this.playersService.getConnectedPlayers()
    // .subscribe(({players}) => {
    //   this.connectedPlayers = players;
    // });

    // FOR FRONTEND TEST
    this.currentPlayer.deck = 
    [
      {family: {id: 0, label: 'Coeur'}, number: 1, isPlayable: true},
      {family: {id: 1, label: 'Coeur'}, number: 2, isPlayable: true},
      {family: {id: 2, label: 'Coeur'}, number: 3, isPlayable: true},
      {family: {id: 3, label: 'Coeur'}, number: 4, isPlayable: true},
      {family: {id: 4, label: 'Coeur'}, number: 5, isPlayable: true},
      {family: {id: 5, label: 'Pique'}, number: 6, isPlayable: false},
      {family: {id: 6, label: 'Pique'}, number: 7, isPlayable: false},
      {family: {id: 7, label: 'Pique'}, number: 8, isPlayable: false},
      {family: {id: 8, label: 'Pique'}, number: 9, isPlayable: false},
      {family: {id: 9, label: 'Pique'}, number: 10, isPlayable: false},
      {family: {id: 10, label: 'Trefle'}, number: 1, isPlayable: false},
      {family: {id: 11, label: 'Trefle'}, number: 2, isPlayable: false},
      {family: {id: 12, label: 'Trefle'}, number: 3, isPlayable: false},
      {family: {id: 13, label: 'Trefle'}, number: 4, isPlayable: false},
      {family: {id: 14, label: 'Trefle'}, number: 5, isPlayable: false},
      {family: {id: 15, label: 'Papayoo'}, number: 6, isPlayable: false},
      {family: {id: 16, label: 'Papayoo'}, number: 7, isPlayable: false},
      {family: {id: 17, label: 'Papayoo'}, number: 8, isPlayable: false},
      {family: {id: 18, label: 'Papayoo'}, number: 9, isPlayable: false},
      {family: {id: 19, label: 'Papayoo'}, number: 10, isPlayable: false},
    ];    
    var j1 = new Player('Jean');
    j1.deck =this.currentPlayer.deck;
    var j2 = new Player('Luc');
    j2.deck =this.currentPlayer.deck;
    var j3 = new Player('Matt');
    j3.deck =this.currentPlayer.deck;
    this.connectedPlayers = [j1,j2,j3];

    this.IsGiveCardTime = true;
    
    this.startRound();
  }
  

  startRound() {
    // TODO pour tests
    setTimeout(() => {
        this.cardFold.push({player: this.connectedPlayers[0], card: this.connectedPlayers[0].deck[this.nbRounds]});
        setTimeout(() => {
            this.cardFold.push({player: this.connectedPlayers[1], card: this.connectedPlayers[1].deck[this.nbRounds]});
            this.canPlayCards();
            this.isCurrentPlayerTurn = true;
          },
          1000);
      },
      1000);
  }

  getIndexOfCard(deck, cardToFind) {
    let cardIndex = -1;
    deck.forEach((card, index) => {
      if (card.family.id === cardToFind.family.id && card.number === cardToFind.number) {
        cardIndex = index;
      }
    });
    return cardIndex;
  }

  currentPlayerPlaysCard(card: Card) {
    // TODO pour tests => géré via websocket
    this.isCurrentPlayerTurn = false;
    this.cardFold.push({player: this.currentPlayer, card});
    this.handleLooser();
    this.currentPlayer.deck.splice(this.getIndexOfCard(this.currentPlayer.deck, card), 1);
    setTimeout(() => {
        this.cardFold = [];
        if (this.currentPlayer.deck.length > 0) {
          this.nbRounds++;
          this.startRound();
        } else {
          this.endRound();
        }
      },
      1000);
  }

  handleLooser() {
    let looser = this.cardFold[0];
    this.cardFold.forEach(playerAndCards => {
      looser = looser.card.number > playerAndCards.card.number ? looser : playerAndCards;
    });
    this.playersService.addLoosingCards(looser.player, this.cardFold.map(plAndCa => plAndCa.card));
  }

  updateCardFold(cards: Card[]) {
    // TODO appelé via websocket pour mettre à jour les cartes jouées dans le pli
  }

  endRound(url = 'scores/en-cours') {
    // TODO appelé via websocket - renvoie soit vers scores/en-cours soit vers scores/game-over
    this.router.navigate([url]);
  }

  // TODO gestion des cartes que le joueur peut jouer ou pas (fonction de la couleur demandée)
  canPlayCards() {
    if (this.cardFold.length !== 0 && this.currentPlayer.deck.some(card => card.family.id === this.cardFold[0].card.family.id)) {
      // cas : au moins une carte de la couleur demandée => seulement cette carte sera jouable
      this.currentPlayer.deck
        .forEach(card => card.isPlayable = card.family.id === this.cardFold[0].card.family.id);
    } else {
      // cas : le joueur est le premier à jouer OU aucune carte de la couleur demandée
      // => toutes les cartes sont jouables
      this.currentPlayer.deck.forEach(card => card.isPlayable = true);
    }
  }
}

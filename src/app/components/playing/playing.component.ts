import {Component, OnInit} from '@angular/core';
import Player from '../../models/player';
import Card from '../../models/card';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';
import { CardsService } from 'src/app/services/cards.service';

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
  isTimeToGiveCard = false;
  cardToGiveErrorMessage;

  constructor(public router: Router, 
    public playersService: PlayersService,
    public cardsService: CardsService,) {
  }
  
  ngOnInit() {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.playersService.getCurrentPlayerDeck().subscribe(({deck}) => {
      this.currentPlayer.deck = deck;
      this.isTimeToGiveCard = true;
    }, error => {console.error(error)});

    this.playersService.getConnectedPlayers()
    .subscribe(({players}) => {
      this.connectedPlayers = players;
    });

    this.cardsService.getDeckWithGivenCards$
      .subscribe((result) => {
        if(result) {
          this.isTimeToGiveCard = false;          
          this.currentPlayer.deck = result.deck;
          this.getBackCards();
        }
      });
  }

  getBackCards() {
    this.currentPlayer.deck.sort((c1, c2) => c1.number - c2.number);
    this.currentPlayer.deck.sort((c1, c2) => c1.family.id - c2.family.id);
    setTimeout(() => {    
      this.currentPlayer.deck.forEach(c => c.newOne=false);      
      this.startRound();
    },
    8000);
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

  getCardToGive() {
    return this.currentPlayer.deck.filter(c => c.toGive);
  }

  clickCard(card: Card) {
    if (this.isTimeToGiveCard) {
      if (!card.toGive && this.getCardToGive().length < 3) {
        this.currentPlayer.deck.find(c => c == card).toGive= true;
      } else {
        this.currentPlayer.deck.find(c => c == card).toGive = false;
      }
    } else {
      // We are playing
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
  }

  giveCards() {
    if (this.getCardToGive().length != 3) {
      this.cardToGiveErrorMessage = 'Tu dois donner 3 cartes';
    } else {
      this.cardsService.giveCard(this.getCardToGive(), this.playersService.getCurrentPlayer().name).subscribe(() => {
        this.isTimeToGiveCard = false;
      });
    }
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

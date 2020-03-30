import {Component} from '@angular/core';
import Player from '../../models/player';
import Card from '../../models/card';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent {

  isCurrentPlayerTurn = false;
  nbRounds = 0;
  currentPlayer: Player;
  connectedPlayers: Player[];
  cardFold: { player: Player, card: Card }[] = [];

  constructor(public router: Router, public playersService: PlayersService) {
    this.playersService.setCurrentPlayerDeck();
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.connectedPlayers = this.playersService.getConnectedPlayers();
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

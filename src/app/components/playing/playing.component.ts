import {Component, OnInit} from '@angular/core';
import Player from '../../models/player';
import Card from '../../models/card';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';
import {CardsService} from 'src/app/services/cards.service';
import {Family} from '../../models/family';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit {

  isCurrentPlayerTurn = false;
  nextPlayerName = '';
  currentPlayer: Player;
  connectedPlayers: Player[];
  family40: Family;
  cardFold: { player: Player, card: Card }[] = [];
  isTimeToGiveCard = false;
  cardToGiveErrorMessage;
  showRoundLooserName = false;
  roundLooserName = '';
  nbRound = 1;
  scoresState = false;
  waitedPlayersForNextRound: Player[] = [];

  constructor(public router: Router,
              public playersService: PlayersService,
              public cardsService: CardsService) {
  }

  ngOnInit() {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.playersService.getCurrentPlayerDeck().subscribe(({deck}) => {
      this.currentPlayer.deck = deck;
      this.isTimeToGiveCard = true;
      this.setAllCardsClickablesOrNot(true);
    }, error => {
      console.error(error);
    });

    this.playersService.getConnectedPlayers().subscribe(({players}) => this.connectedPlayers = players);

    this.cardsService.getDeckWithGivenCards$.subscribe((result) => {
      if (result.deck) {
        this.isTimeToGiveCard = false;
        this.currentPlayer.deck = result.deck;
        this.family40 = result.family40;
        this.getBackCards();
        this.setAllCardsClickablesOrNot(false);
      }
    });

    this.playersService.nextPlayerTurn$.subscribe(result => {
      if (result.nextPlayerName) {
        this.nextPlayerName = result.nextPlayerName;
        this.cardFold = result.cardsPlayedWithPlayer;
        if (result.nextPlayerName === this.currentPlayer.name) {
          // c'est au tour du joueur de jouer
          this.isCurrentPlayerTurn = true;
          this.canPlayCards();
        } else {
          this.isCurrentPlayerTurn = false;
          this.setAllCardsClickablesOrNot(false);
        }
      }
    });

    this.playersService.roundLooser$.subscribe(roundLooserName => {
      if (roundLooserName) {
        this.setAllCardsClickablesOrNot(false);
        this.handleRoundLooser(roundLooserName);
      }
    });

    this.playersService.endOfTour$.subscribe(players => {
      if (players.length > 0) {
        this.setAllCardsClickablesOrNot(false);
        this.endTour(players);
      }
    });

    this.playersService.waitedPlayersForNextRound$.subscribe(players => {
      if (players.length > 0) {
        this.waitedPlayersForNextRound = players;
      }
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
    if (this.isTimeToGiveCard) {
      if (!card.toGive && this.getCardToGive().length < 3) {
        this.currentPlayer.deck.find(c => c === card).toGive = true;
      } else {
        this.currentPlayer.deck.find(c => c === card).toGive = false;
      }
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

  giveCards() {
    if (this.getCardToGive().length !== 3) {
      this.cardToGiveErrorMessage = 'Tu dois donner 3 cartes';
    } else {
      this.cardsService.giveCard(this.getCardToGive(), this.playersService.getCurrentPlayer().name)
        .subscribe(() => {
          this.isTimeToGiveCard = false;
          this.setAllCardsClickablesOrNot(false);
        });
    }
  }

  handleRoundLooser(roundLooserName: string) {
    this.showRoundLooserName = true;
    this.roundLooserName = roundLooserName;
    setTimeout(
      () => {
        this.showRoundLooserName = false;
        this.nbRound++;
      },
      4000
    );
  }

  endTour(players: Player[]) {
    // TODO : renvoyer soit vers '/scores/en-cours' soit vers '/scores/game-over' => pr un meilleur affichage ?
    this.connectedPlayers = players;
    this.waitedPlayersForNextRound = players;
    this.scoresState = true;
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
      this.isCurrentPlayerTurn = false;
      this.nextPlayerName = '';
      this.cardFold = [];
      this.isTimeToGiveCard = false;
      this.showRoundLooserName = false;
      this.roundLooserName = '';
      this.nbRound = 1;
      this.family40 = null;
    });
  }
}

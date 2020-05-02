import {Component, OnDestroy, OnInit} from '@angular/core';
import Player from '../../models/player';
import Card from '../../models/card';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';
import {CardsService} from 'src/app/services/cards.service';
import {FAMILIES, Family} from '../../models/family';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  currentPlayer: Player;

  // Existing states:
  /*
  partyState = ...
  *  'givingCards' => (cardsGived = true): afficher tu reçois x de et donne à x
  *  'givingCards' => (cardsGived = false): attente don des autres joueurs
  *
  *  'playing' => (isCurrentPlayerTurn = false, showRoundLooserName = false): attente de son tour de jeu
  *  'playing' => (isCurrentPlayerTurn = true, showRoundLooserName = false): Son tour de jeu / surligner Moi: ... et afficher à toi de jouer
  *  'playing' => (isCurrentPlayerTurn = false, showRoundLooserName = true): pli complet - afficher ce pli est pour...
  *  'playing' => (family40 = true): afficher le 7 de...
  *
  *  'endTourScores' => (isReady = false): afficher scores du tour et bouton passer tour suivant...
  *  'endTourScores' => (isReady = true): afficher scores du tour et cacher bouton tour suivant
  * */
  partyState: '' | 'givingCards' | 'playing' | 'endTourScores' = '';

  // givingCards (cardsGived)
  cardsGived = false;
  nbCardToGive = 5;
  previousPlayer: Player;
  nextPlayer: Player;
  waitedGivingCardsPlayers: Player[] = [];

  // playing (isCurrentPlayerTurn, showRoundLooserName, !!family40)
  isCurrentPlayerTurn = false;
  showRoundLooserName = false;
  family40: Family;
  playerNameWaitedToPlay = '';
  connectedPlayers: Player[];
  cardFold: { player: Player, card: Card }[] = [];
  leftPlayers: Player[] = [];
  rightPlayers: Player[] = [];
  roundLooserName = '';

  // endTourScores (isReady)
  isReady = false;
  waitedPlayersForNextTour: Player[] = [];

  constructor(public router: Router,
              public playersService: PlayersService,
              public cardsService: CardsService) {
  }

  ngOnInit() {
    // this.testFrontOnly();
    this.initComponent();
  }

  setPartyState(newState: '' | 'givingCards' | 'playing' | 'endTourScores') {
    console.log('newState', newState);
    this.partyState = newState;
  }

  initComponent() {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.initDeck();

    this.playersService.getConnectedPlayers().pipe(takeUntil(this.ngUnsubscribe)).subscribe((players: Player[]) => {
      this.connectedPlayers = players;
      this.setLeftAndRightPlayers();
      this.setNbCardToGive();
      this.setPartyState('givingCards');
    });

    this.playersService.waitedGivingCardsPlayers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((players: Player[]) => this.waitedGivingCardsPlayers = players);
    this.cardsService.getDeckWithGivenCards().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { deck: Card[], family40: Family }) => {
        this.currentPlayer.deck = result.deck;
        this.family40 = result.family40;
        this.getBackCards();
        this.setAllCardsClickablesOrNot(false);
        this.setPartyState('playing');
      });
    this.playersService.yourTurn().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((cardsPlayedWithPlayer: { card: Card, player: Player }[]) =>
        this.yourTurn(cardsPlayedWithPlayer));
    this.playersService.nextPlayerTurn().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { playerNameWaitedToPlay: string, cardsPlayedWithPlayer: { card: Card, player: Player }[] }) =>
        this.nextPlayerTurn(result));
    this.playersService.roundLooser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { looser: Player, playedCardsOfRound: { card: Card, player: Player }[] }) =>
        this.handleRoundLooser(result.looser, result.playedCardsOfRound));
    this.playersService.endOfTour().pipe(takeUntil(this.ngUnsubscribe)).subscribe(players => this.endTour(players));
    this.playersService.waitedPlayersForNextTour().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(players => this.waitedPlayersForNextTour = players);
    this.playersService.newTour().pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.newTour());
    this.playersService.gameOver().pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.gameOver());
    this.playersService.playerDisconnected().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((name: string) => this.playerDisconnection(name));
  }

  initDeck() {
    this.playersService.getCurrentPlayerDeck().subscribe(({deck}) => {
      this.currentPlayer.deck = deck;
      this.setAllCardsClickablesOrNot(true);
    }, error => {
      console.error(error);
    });
  }

  setAllCardsClickablesOrNot(clickability: boolean) {
    this.currentPlayer.deck.forEach(card => card.isPlayable = clickability);
  }

  testFrontOnly() {
    const deck = [
      new Card(3, FAMILIES[0], true, false, false),
      new Card(6, FAMILIES[0], true, false),
      new Card(6, FAMILIES[1], true, false, false),
      new Card(7, FAMILIES[1], true, false),
      new Card(10, FAMILIES[1], true, false),
      new Card(1, FAMILIES[2], true, false),
      new Card(3, FAMILIES[2], true, false),
      new Card(7, FAMILIES[2], true, false),
      new Card(8, FAMILIES[2], true, false, false),
      new Card(2, FAMILIES[3], true, false),
      new Card(3, FAMILIES[3], true, false),
      new Card(8, FAMILIES[3], true, false),
      new Card(9, FAMILIES[3], true, false, false),
      new Card(2, FAMILIES[4], true, false),
      new Card(4, FAMILIES[4], true, false, false),
      new Card(6, FAMILIES[4], true, false),
      new Card(7, FAMILIES[4], true, false),
      new Card(8, FAMILIES[4], true, false),
      new Card(13, FAMILIES[4], true, false),
      new Card(20, FAMILIES[4], true, false),
    ];
    this.currentPlayer = new Player('matt', deck, 'red');
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
    this.setPartyState('givingCards');
    this.setAllCardsClickablesOrNot(true);
    this.family40 = FAMILIES[3];

    for (let i = 0; i < this.connectedPlayers.length; i++) {
      this.cardFold.push({player: this.connectedPlayers[i], card: new Card(i + 2, FAMILIES[4])});
    }

    this.playerNameWaitedToPlay = 'matt';
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

  isCardsInDeckOfFamilyASked() {
    // renvoit true si, dans le deck du joueur, il y a une carte (non jouée) qui est de la famille demandée par la première carte du pli
    return this.currentPlayer.deck
      .filter(card => !card.played)
      .some(card => card.family.id === this.cardFold[0].card.family.id);
  }

  canPlayCards() {
    if (this.cardFold.length !== 0 && this.isCardsInDeckOfFamilyASked()) {
      console.log('canPlayCards - cardFold pas vide');
      // cas : au moins une carte de la couleur demandée => seulement cette carte sera jouable
      this.currentPlayer.deck.forEach(card => card.isPlayable = card.family.id === this.cardFold[0].card.family.id);
    } else {
      console.log('canPlayCards - cardFold vide ou aucune carte de la couleur demandée');
      // cas : le joueur est le premier à jouer OU aucune carte de la couleur demandée
      // => toutes les cartes sont jouables
      this.setAllCardsClickablesOrNot(true);
    }
  }

  yourTurn(cardsPlayedWithPlayer: { card: Card; player: Player }[]) {
    this.cardFold = cardsPlayedWithPlayer;
    this.isCurrentPlayerTurn = true;
    this.playerNameWaitedToPlay = this.currentPlayer.name;
    this.showRoundLooserName = false;
    console.log('yourTurn(cardsPlayedWithPlayer) - canPlayCards()', cardsPlayedWithPlayer);
    this.canPlayCards();
  }

  nextPlayerTurn({playerNameWaitedToPlay, cardsPlayedWithPlayer}) {
    this.isCurrentPlayerTurn = false;
    this.showRoundLooserName = false;
    this.playerNameWaitedToPlay = playerNameWaitedToPlay;
    this.cardFold = cardsPlayedWithPlayer;
  }

  getBackCards() {
    this.currentPlayer.deck.sort((c1, c2) => c1.number - c2.number);
    this.currentPlayer.deck.sort((c1, c2) => c1.family.id - c2.family.id);
    setTimeout(() => this.currentPlayer.deck.forEach(c => c.newOne = false), 3000);
  }

  getCardToGive() {
    return this.currentPlayer.deck.filter(c => c.toGive);
  }

  selectCardToGive(card: Card) {
    this.currentPlayer.deck
      .find(c => c === card)
      .toGive = !card.toGive && this.getCardToGive().length < this.nbCardToGive;
  }

  clickCard(card: Card) {
    this.setAllCardsClickablesOrNot(false);
    this.cardsService.playCard(card, this.currentPlayer.name)
      .subscribe(
        () => {
          // const currentCard = this.currentPlayer.deck.find(c => c.family.id === card.family.id && c.number === card.number);
          // currentCard.played = true;
          card.played = true;
        },
        error => {
          console.log('card', card);
          console.error('n\' a pas été jouée', error);
          console.log('clickCard(card) - error => canPlayCards(), cardFold:', this.cardFold);
          this.canPlayCards();
        }
      );
  }

  giveCards() {
    this.cardsGived = true;
    this.cardsService.giveCard(this.getCardToGive(), this.playersService.getCurrentPlayer().name)
      .subscribe(
        () => {
          this.setAllCardsClickablesOrNot(false);
        },
        error => {
          console.error('cartes pas données...');
          console.error(error);
          this.cardsGived = false;
        });
  }

  handleRoundLooser(roundLooser: Player, playedCardsOfRound: { card: Card, player: Player }[]) {
    this.setAllCardsClickablesOrNot(false);
    this.cardFold = playedCardsOfRound;
    this.updateLooserRoundScore(roundLooser);
    this.showRoundLooserName = true;
    this.roundLooserName = roundLooser.name;
  }

  updateLooserRoundScore(roundLooser: Player) {
    if (roundLooser.name === this.currentPlayer.name) {
      this.currentPlayer.roundScore = roundLooser.roundScore;
    } else {
      const looser = this.connectedPlayers.find(player => player.name === roundLooser.name);
      looser.roundScore = roundLooser.roundScore;
    }
  }

  endTour(players: Player[]) {
    this.setPartyState('endTourScores');
    this.isReady = false;
    players.forEach(player => {
      if (player.name === this.currentPlayer.name) {
        this.currentPlayer.roundScore = player.roundScore;
        this.currentPlayer.globalScore = player.globalScore;
      }
      const playerToUpdate = this.connectedPlayers.find(connectedPlayer => player.name === connectedPlayer.name);
      playerToUpdate.roundScore = player.roundScore;
      playerToUpdate.globalScore = player.globalScore;
    });
    this.waitedPlayersForNextTour = players;
  }

  readyForNextTour() {
    this.playersService.readyForNextTour().subscribe(() => {
      this.isReady = true;
      this.isCurrentPlayerTurn = false;
      this.showRoundLooserName = false;
      this.cardFold = [];
      this.family40 = null;
      this.connectedPlayers.forEach(player => player.roundScore = 0);
      this.currentPlayer.roundScore = 0;
    });
  }

  newTour() {
    this.playersService.getCurrentPlayerDeck().subscribe(({deck}) => {
      this.currentPlayer.deck = deck;
      this.setAllCardsClickablesOrNot(true);
      this.cardsGived = false;
      this.setPartyState('givingCards');
    }, error => {
      console.error(error);
    });
  }

  gameOver() {
    this.router.navigate(['scores']);
  }

  playerDisconnection(name: string) {
    alert(name + ' a quitté le jeu...');
    this.router.navigate(['login']);
  }

  is40Seven(card: Card): boolean {
    return this.family40 && card.family.id === this.family40.id && card.number === 7;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

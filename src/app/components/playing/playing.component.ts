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
  family40Label = '';
  playerNameWaitedToPlay = '';
  connectedPlayers: Player[];
  cardFold: { player: Player, card: Card }[] = [];
  foldMaster: Player = new Player();
  topPlayer: Player;
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
      this.waitedGivingCardsPlayers = players;
      this.setLeftAndRightPlayers();
      this.setNbCardToGive();
      this.setPartyState('givingCards');
    });

    this.playersService.waitedGivingCardsPlayers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((players: Player[]) => this.waitedGivingCardsPlayers = players);
    this.cardsService.getDeckWithGivenCards().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { deck: Card[], family40: Family }) => {
        this.currentPlayer.deck = result.deck;
        this.setFamily40(result.family40);
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
      new Card(7, FAMILIES[3], true, false),
      new Card(9, FAMILIES[3], true, false, false),
      new Card(2, FAMILIES[4], true, false),
      new Card(4, FAMILIES[4], true, false, false),
      new Card(6, FAMILIES[4], true, false),
      new Card(7, FAMILIES[4], true, false),
      new Card(8, FAMILIES[4], true, false),
      new Card(13, FAMILIES[4], true, false),
      new Card(20, FAMILIES[4], true, false),
    ];
    this.connectedPlayers = [
      new Player('mimi'),
      new Player('matt'),
      new Player('hugo'),
      // new Player('gu'),
      // new Player('clé'),
      // new Player('marion'),
      new Player('mélanie'),
      // new Player('coco'),
    ];

    this.connectedPlayers.forEach((player, i) => player.currentCard = new Card((i + 1) * 2, FAMILIES[4]));
    this.currentPlayer.deck = deck;

      // this.connectedPlayers.forEach((player, i) => {
      // const card = new Card((i + 1) * 2, FAMILIES[4]);
      // this.cardFold.push({player, card});
      // player.currentCard = card;
      // this.updateFoldMaster(player);
    // });

    // this.currentPlayer = this.connectedPlayers.find(player => player.name === 'matt');

    this.setLeftAndRightPlayers();
    this.setNbCardToGive();
    this.waitedGivingCardsPlayers = this.connectedPlayers;
    this.setPartyState('givingCards');
    /*
    this.setAllCardsClickablesOrNot(true);
    this.setFamily40(FAMILIES[0]);

    this.isCurrentPlayerTurn = true;
    this.playerNameWaitedToPlay = 'mimi';
    */
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
    if (this.connectedPlayers.length % 2 === 0) {
      // si le nombre de joueurs est pair => on est met un au centre en haut (le premier de la liste de gauche)
      this.topPlayer = this.leftPlayers.splice(0, 1)[0];
    }

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
    if (cardsPlayedWithPlayer.length > 0) {
      this.updatePlayersCard(cardsPlayedWithPlayer);
    } else {
      this.cleanFold();
    }
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
    console.log('nextPlayerTurn(cardsPlayedWithPlayer)', cardsPlayedWithPlayer);
    this.cardFold = cardsPlayedWithPlayer;
    if (cardsPlayedWithPlayer.length > 0) {
      this.updatePlayersCard(cardsPlayedWithPlayer);
    } else {
      this.cleanFold();
    }
  }

  updatePlayersCard(cardsPlayedWithPlayer: { card: Card; player: Player }[]) {
    const lastPlayerAndCard = cardsPlayedWithPlayer[cardsPlayedWithPlayer.length - 1];
    if (this.topPlayer && this.topPlayer.name === lastPlayerAndCard.player.name) {
      // si le dernier joueur est le joueur d'en haut
      this.topPlayer.currentCard = lastPlayerAndCard.card;
      this.updateFoldMaster(this.topPlayer);
    } else if (this.currentPlayer.name === lastPlayerAndCard.player.name) {
      // si le dernier joueur est le joueur courrant
      this.currentPlayer.currentCard = lastPlayerAndCard.card;
      this.updateFoldMaster(this.currentPlayer);
    } else if (this.leftPlayers.some(player => player.name === lastPlayerAndCard.player.name)) {
      // si le dernier joueur est dans la colonne de gauche
      const playerToUpdate = this.leftPlayers.find(player => player.name === lastPlayerAndCard.player.name);
      playerToUpdate.currentCard = lastPlayerAndCard.card;
      this.updateFoldMaster(playerToUpdate);
    } else if (this.rightPlayers.some(player => player.name === lastPlayerAndCard.player.name)) {
      // si le dernier joueur est dans la colonne de droite
      const playerToUpdate = this.rightPlayers.find(player => player.name === lastPlayerAndCard.player.name);
      playerToUpdate.currentCard = lastPlayerAndCard.card;
      this.updateFoldMaster(playerToUpdate);
    }
  }

  cleanFold() {
    // aucune carte dans le pli / nouveau tour => vide les cartes de tous les joueurs
    if (this.topPlayer) {
      this.topPlayer.currentCard = null;
    }
    this.leftPlayers.forEach(player => player.currentCard = null);
    this.currentPlayer.currentCard = null;
    this.rightPlayers.forEach(player => player.currentCard = null);
    this.foldMaster = null;
  }

  updateFoldMaster(player: Player) {
    if (this.cardFold.length === 1) {
      this.foldMaster = player;
      console.log('updateFoldMaster - cardFold.length === 1', this.foldMaster);
    } else {
      this.foldMaster =
        this.foldMaster.currentCard.family.id === player.currentCard.family.id &&
        this.foldMaster.currentCard.number < player.currentCard.number ?
          player : this.foldMaster;
      console.log('updateFoldMaster -cardFold.length > 1', this.foldMaster);
    }
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
    card.played = true;
    this.currentPlayer.currentCard = card;
    this.setAllCardsClickablesOrNot(false);
    this.cardsService.playCard(card, this.currentPlayer.name)
      .subscribe(
        () => console.log(card.number + ' ' + card.family.label + ' jouée'),
        error => {
          this.currentPlayer.currentCard = null;
          console.log(card.number + ' ' + card.family.label + ' n\'a pas été jouée');
          console.error(error);
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
    this.updatePlayersCard(playedCardsOfRound);
    this.updateLooserRoundScore(roundLooser);
    this.showRoundLooserName = true;
    this.roundLooserName = roundLooser.name;
  }

  updateLooserRoundScore(roundLooser: Player) {
    if (this.currentPlayer.name === roundLooser.name) {
      // si le looser est le joueur courrant
      this.currentPlayer.roundScore = roundLooser.roundScore;
    } else if (this.topPlayer && this.topPlayer.name === roundLooser.name) {
      // si le looser est au dessus
      this.topPlayer.roundScore = roundLooser.roundScore;
    } else if (this.leftPlayers.some(player => player.name === roundLooser.name)) {
      // si le looser est dans la colonne de gauche
      const looser = this.leftPlayers.find(player => player.name === roundLooser.name);
      looser.roundScore = roundLooser.roundScore;
    } else if (this.rightPlayers.some(player => player.name === roundLooser.name)) {
      // si le looser est dans la colonne de droite
      const looser = this.rightPlayers.find(player => player.name === roundLooser.name);
      looser.roundScore = roundLooser.roundScore;
    }
  }
// en attente pas setté direct
//   slide des cartes vers haut/bas/ghe/dte quand pli fini
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
    return card && this.family40 && card.family.id === this.family40.id && card.number === 7;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  getGameBoardHeight() {
    switch (this.connectedPlayers.length) {
      case 3:
        return {height: '190px'};
      case 4:
        return {height: '314px'};
      case 5:
        return {height: '274px'};
      case 6:
        return {height: '314px'};
      case 7:
        return {height: '274px'};
      case 8:
        return {height: '314px'};
    }
  }

  setFamily40(family40: Family) {
    this.family40 = family40;
    switch (family40.id) {
      case 0:
        this.family40Label = 'spades';
        break;
      case 1:
        this.family40Label = 'hearts';
        break;
      case 2:
        this.family40Label = 'diamonds';
        break;
      case 3:
        this.family40Label = 'chamrocks';
        break;
      case 4:
        this.family40Label = 'papayoos';
        break;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

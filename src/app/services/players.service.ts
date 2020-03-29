import {Injectable} from '@angular/core';
import Player from '../models/player';
import {FAMILIES} from '../models/family';
import Card from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private currentPlayer: Player;
  private connectedPlayers: Player[] = [];

  constructor() {
    this.currentPlayer = new Player();
    this.connectedPlayers = [
      new Player('mimi', [
        new Card(3, FAMILIES[1]),
        new Card(8, FAMILIES[4]),
        new Card(10, FAMILIES[3]),
      ]),
      new Player('cle', [
        new Card(7, FAMILIES[1]),
        new Card(9, FAMILIES[4]),
        new Card(5, FAMILIES[3]),
      ]),
      this.currentPlayer
    ];
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  setCurrentPlayerName(name: string) {
    this.currentPlayer.name = name;
  }

  setCurrentPlayerDeck(deck: Card[] = [
    new Card(5, FAMILIES[1]),
    new Card(1, FAMILIES[4]),
    new Card(9, FAMILIES[3]),
  ]) {
    this.currentPlayer.deck = deck;
  }

  getConnectedPlayers(): Player[] {
    return this.connectedPlayers;
  }

  setConnectedPlayers(players: Player[]) {
    this.connectedPlayers = players;
  }

  addLoosingCards(looser: Player, cards: Card[]) {
    // TODO géré et mis à jour via websocket (où ??)
    const theLooser = this.connectedPlayers.find(player => player.name === looser.name);
    theLooser.collectedLoosingCards = theLooser.collectedLoosingCards.concat(cards);
    console.log('this.connectedPlayers', this.connectedPlayers);
  }
}

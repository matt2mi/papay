import {Injectable} from '@angular/core';
import Player from '../models/player';
import Card from '../models/card';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private currentPlayer: Player;

  private createPlayerSource = new BehaviorSubject(null);
  createPlayer$ = this.createPlayerSource.asObservable();

  private playersSource = new BehaviorSubject([]);
  getNewPlayers$ = this.playersSource.asObservable();

  private partyStartedSource = new BehaviorSubject(null);
  partyStarted$ = this.partyStartedSource.asObservable();

  constructor(public http: HttpClient, public socket: Socket) {
    this.currentPlayer = new Player();
  }

  createPlayer(name: string) {
    this.socket.emit('createPlayer', name);
  }

  initSocket() {
    this.socket.on('newPlayer', players => {
      this.playersSource.next(players);
    });
    this.socket.on('creatingPlayer', result => {
      this.createPlayerSource.next(result);
    });
    this.socket.on('partyStarted', start => {
      this.partyStartedSource.next(start);
    });
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  setCurrentPlayerName(name: string) {
    this.currentPlayer.name = name;
  }

  getCurrentPlayerDeck(): Observable<{deck : Card[]}> {
    return this.http.get<{deck : Card[]}>(`getDeck/${this.currentPlayer.name}`);
  }

  getConnectedPlayers(): Observable<{ players: Player[] }> {
    return this.http.get<{ players: Player[] }>('players');
  }

  addLoosingCards(looser: Player, cards: Card[]) {
    // TODO géré et mis à jour via websocket (où ??)
    // const theLooser = this.connectedPlayers.find(player => player.name === looser.name);
    // theLooser.collectedLoosingCards = theLooser.collectedLoosingCards.concat(cards);
    // console.log('this.connectedPlayers', this.connectedPlayers);
  }

  startParty() {
    return this.http.get('startParty');
  }
}

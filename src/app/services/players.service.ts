import {Injectable} from '@angular/core';
import Player from '../models/player';
import Card from '../models/card';
import {HttpClient} from '@angular/common/http';
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

  private nextPlayerTurnSource = new BehaviorSubject({nextPlayerName: '', cardsPlayedWithPlayer: []});
  nextPlayerTurn$ = this.nextPlayerTurnSource.asObservable();

  private roundLooserSource = new BehaviorSubject('');
  roundLooser$ = this.roundLooserSource.asObservable();

  private endOfTourSource = new BehaviorSubject([]);
  endOfTour$ = this.endOfTourSource.asObservable();

  private waitedPlayersForNextRoundSource = new BehaviorSubject([]);
  waitedPlayersForNextRound$ = this.waitedPlayersForNextRoundSource.asObservable();

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
    this.socket.on('nextPlayerTurn', (result: { nextPlayerName: string, cardsPlayedWithPlayer: { card: Card, player: Player }[] }) => {
      this.nextPlayerTurnSource.next(result);
    });
    this.socket.on('roundLooser', (roundLooserName) => {
      this.roundLooserSource.next(roundLooserName);
    });
    this.socket.on('endOfTour', (players) => {
      this.endOfTourSource.next(players);
    });
    this.socket.on('waitedPlayersForNextRound', (players) => {
      this.waitedPlayersForNextRoundSource.next(players);
    });
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  setCurrentPlayerName(name: string) {
    this.currentPlayer.name = name;
  }

  getCurrentPlayerDeck(): Observable<{ deck: Card[] }> {
    return this.http.get<{ deck: Card[] }>(`getDeck/${this.currentPlayer.name}`);
  }

  getConnectedPlayers(): Observable<{ players: Player[] }> {
    return this.http.get<{ players: Player[] }>('players');
  }

  startParty() {
    return this.http.get('startParty');
  }

  readyForNextTour(): Observable<boolean> {
    return this.http.get<boolean>('goNextTour/' + this.currentPlayer.name);
  }
}

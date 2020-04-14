import {Injectable} from '@angular/core';
import Player from '../models/player';
import Card from '../models/card';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {skip} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private currentPlayer: Player;

  // skip(1) permet de ne pas envoyer le premier appel dû à l'abonnement dans chaque component et d'attendre le vrai retour
  private newPlayersSource = new BehaviorSubject([]);
  newPlayers$ = this.newPlayersSource.asObservable().pipe(skip(1));

  private createPlayerSource = new BehaviorSubject(null);
  createPlayer$ = this.createPlayerSource.asObservable().pipe(skip(1));

  private partyStartedSource = new BehaviorSubject(null);
  partyStarted$ = this.partyStartedSource.asObservable().pipe(skip(1));

  private nextPlayerTurnSource = new BehaviorSubject({nextPlayerName: '', cardsPlayedWithPlayer: []});
  nextPlayerTurn$ = this.nextPlayerTurnSource.asObservable().pipe(skip(1));

  private roundLooserSource = new BehaviorSubject('');
  roundLooser$ = this.roundLooserSource.asObservable().pipe(skip(1));

  private endOfTourSource = new BehaviorSubject([]);
  endOfTour$ = this.endOfTourSource.asObservable().pipe(skip(1));

  private waitedPlayersForNextRoundSource = new BehaviorSubject([]);
  waitedPlayersForNextRound$ = this.waitedPlayersForNextRoundSource.asObservable().pipe(skip(1));

  private newTourSource = new BehaviorSubject(null);
  newTour$ = this.newTourSource.asObservable().pipe(skip(1));

  private gameOverSource = new BehaviorSubject([]);
  gameOver$ = this.gameOverSource.asObservable().pipe(skip(1));

  constructor(public http: HttpClient, public socket: Socket) {
    this.currentPlayer = new Player();
  }

  createPlayer(name: string) {
    this.socket.emit('createPlayer', name);
  }

  initSocket() {
    this.socket.on('newPlayer', (players: Player[]) => this.newPlayersSource.next(players));
    this.socket.on('creatingPlayer', (result: { name: string, error: { value: boolean, message: string } }) =>
      this.createPlayerSource.next(result));
    this.socket.on('partyStarted', () => this.partyStartedSource.next(null));
    this.socket.on('nextPlayerTurn',
      (result: { nextPlayerName: string, cardsPlayedWithPlayer: { card: Card, player: Player }[] }) =>
        this.nextPlayerTurnSource.next(result));
    this.socket.on('roundLooser', (roundLooserName: string) => this.roundLooserSource.next(roundLooserName));
    this.socket.on('endOfTour', (players: Player[]) => this.endOfTourSource.next(players));
    this.socket.on('waitedPlayersForNextRound', (players: Player[]) =>
      this.waitedPlayersForNextRoundSource.next(players));
    this.socket.on('newTour', () => this.newTourSource.next(null));
    this.socket.on('gameOver', (players: Player[]) => this.gameOverSource.next(players));
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

  getConnectedPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('players');
  }

  startParty() {
    return this.http.get('startParty');
  }

  readyForNextTour(): Observable<boolean> {
    return this.http.get<boolean>('goNextTour/' + this.currentPlayer.name);
  }
}

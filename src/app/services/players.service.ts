import {Injectable} from '@angular/core';
import Player from '../models/player';
import Card from '../models/card';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private currentPlayer: Player;
  private newPlayers$: Observable<Player[]>;
  private creatingPlayer$: Observable<{ name: string, color: string, error: { value: boolean, message: string } }>;
  private youAreKicked$: Observable<string>;
  private playerKicked$: Observable<{ kickedName: string, kickerName: string, players: Player[] }>;
  private partyStarted$: Observable<void>;
  private waitedGivingCardsPlayers$: Observable<Player[]>;
  private yourTurn$: Observable<{ card: Card, player: Player }[]>;
  private nextPlayerTurn$: Observable<{ playerNameWaitedToPlay: string, cardsPlayedWithPlayer: { card: Card, player: Player }[] }>;
  private roundLooser$: Observable<{ looser: Player, playedCardsOfRound: { card: Card, player: Player }[] }>;
  private endOfTour$: Observable<Player[]>;
  private waitedPlayersForNextTour$: Observable<Player[]>;
  private newTour$: Observable<void>;
  private gameOver$: Observable<Player[]>;
  private playerDisconnected$: Observable<string>;

  constructor(public http: HttpClient, public socket: Socket) {
    this.currentPlayer = new Player();
  }

  createPlayer(name: string) {
    this.socket.emit('createPlayer', name);
  }

  newPlayers(): Observable<Player[]> {
    return this.newPlayers$ = new Observable((observer) =>
      this.socket.on('newPlayer', (players: Player[]) => {
        console.log('socket.on(newPlayer)', players);
        observer.next(players);
      }));
  }

  creatingPlayer(): Observable<{ name: string, color: string, error: { value: boolean, message: string } }> {
    return this.creatingPlayer$ = new Observable((observer) =>
      this.socket.on('creatingPlayer',
        (result: { name: string, color: string, error: { value: boolean, message: string } }) => {
          console.log('socket.on(creatingPlayer)', result);
          observer.next(result);
        }));
  }

  youAreKicked(): Observable<string> {
    return this.youAreKicked$ = new Observable((observer) =>
      this.socket.on('youAreKicked',
        (kickerName: string) => {
          console.log('socket.on(youAreKicked)', kickerName);
          observer.next(kickerName);
        }));
  }

  playerKicked(): Observable<{ kickedName: string, kickerName: string, players: Player[] }> {
    return this.playerKicked$ = new Observable((observer) =>
      this.socket.on('playerKicked',
        (result: { kickedName: string, kickerName: string, players: Player[] }) => {
          console.log('socket.on(playerKicked)', result);
          observer.next(result);
        }));
  }

  partyStarted(): Observable<void> {
    return this.partyStarted$ = new Observable((observer) =>
      this.socket.on('partyStarted', () => {
        console.log('socket.on(partyStarted)');
        observer.next();
      }));
  }

  waitedGivingCardsPlayers(): Observable<Player[]> {
    return this.waitedGivingCardsPlayers$ = new Observable((observer) =>
      this.socket.on('waitedGivingCardsPlayers', (players: Player[]) => {
        console.log('socket.on(waitedGivingCardsPlayers)', players);
        observer.next(players);
      }));
  }

  yourTurn(): Observable<{ card: Card, player: Player }[]> {
    return this.yourTurn$ = new Observable((observer) =>
      this.socket.on('yourTurn', (cardFold: { card: Card, player: Player }[]) => {
        console.log('socket.on(yourTurn)', cardFold);
        observer.next(cardFold);
      }));
  }

  nextPlayerTurn(): Observable<{ playerNameWaitedToPlay: string, cardsPlayedWithPlayer: { card: Card, player: Player }[] }> {
    return this.nextPlayerTurn$ = new Observable((observer) =>
      this.socket.on('nextPlayerTurn',
        (result: { playerNameWaitedToPlay: string, cardsPlayedWithPlayer: { card: Card, player: Player }[] }) => {
          console.log('socket.on(nextPlayerTurn)', result);
          observer.next(result);
        }));
  }

  roundLooser(): Observable<{ looser: Player, playedCardsOfRound: { card: Card, player: Player }[] }> {
    return this.roundLooser$ = new Observable((observer) =>
      this.socket.on('roundLooser',
        (result: { looser: Player, playedCardsOfRound: { card: Card, player: Player }[] }) => {
          console.log('socket.on(roundLooser)', result);
          observer.next(result);
        }));
  }

  endOfTour(): Observable<Player[]> {
    return this.endOfTour$ = new Observable((observer) =>
      this.socket.on('endOfTour', (players: Player[]) => {
        console.log('socket.on(endOfTour)', players);
        observer.next(players);
      }));
  }

  waitedPlayersForNextTour(): Observable<Player[]> {
    return this.waitedPlayersForNextTour$ = new Observable((observer) =>
      this.socket.on('waitedPlayersForNextTour', (players: Player[]) => {
        console.log('socket.on(waitedPlayersForNextTour)', players);
        observer.next(players);
      }));
  }

  newTour(): Observable<void> {
    return this.newTour$ = new Observable((observer) =>
      this.socket.on('newTour', () => {
        console.log('socket.on(newTour)');
        observer.next();
      }));
  }

  gameOver(): Observable<Player[]> {
    return this.gameOver$ = new Observable((observer) =>
      this.socket.on('gameOver', (players: Player[]) => {
        console.log('socket.on(gameOver)', players);
        observer.next(players);
      }));
  }

  playerDisconnected(): Observable<string> {
    return this.playerDisconnected$ = new Observable((observer) =>
      this.socket.on('playerDisconnected', (name: string) => {
        console.log('socket.on(playerDisconnected)', name);
        observer.next(name);
      }));
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  setCurrentPlayerNameAndColor(name: string, color: string) {
    this.currentPlayer.name = name;
    this.currentPlayer.color = color;
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

  deletePlayer(name: string): Observable<{ message: string, error: Error }> {
    return this.http.post<{ message: string, error: Error }>(
      'deletePlayer',
      {kickedName: name, kickerName: this.currentPlayer.name}
    );
  }
}

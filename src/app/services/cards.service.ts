import {Injectable} from '@angular/core';
import Card from '../models/card';
import {BehaviorSubject, Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {HttpClient} from '@angular/common/http';
import {skip} from 'rxjs/internal/operators';
import {Family} from '../models/family';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private getDeckWithGivenSource = new BehaviorSubject(null);
  getDeckWithGivenCards$ = this.getDeckWithGivenSource.asObservable().pipe(skip(1));

  constructor(public http: HttpClient, public socket: Socket) {
  }

  initSocket() {
    this.socket.on('newDeck', (deckAndFamily40: { deck: Card[], family40: Family }) =>
      this.getDeckWithGivenSource.next(deckAndFamily40));
  }

  giveCard(cards: Card[], name: string): Observable<{ cards: Card[], name: string }> {
    return this.http.post<{ cards: Card[], name: string }>('giveCards', {cards, name});
  }

  playCard(card: Card, playerName: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('playCard', {card, playerName});
  }
}

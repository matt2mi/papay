import {Injectable} from '@angular/core';
import Card from '../models/card';
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {HttpClient} from '@angular/common/http';
import {Family} from '../models/family';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private getDeckWithGivenCards$: Observable<{ deck: Card[], family40: Family }>;

  constructor(public http: HttpClient, public socket: Socket) {
  }

  getDeckWithGivenCards(): Observable<{ deck: Card[], family40: Family }> {
    return this.getDeckWithGivenCards$ = new Observable((observer) =>
      this.socket.on('newDeck', (deckAndFamily40: { deck: Card[], family40: Family }) =>
        observer.next(deckAndFamily40)));
  }

  giveCard(cards: Card[], name: string): Observable<{ cards: Card[], name: string }> {
    return this.http.post<{ cards: Card[], name: string }>('giveCards', {cards, name});
  }

  playCard(card: Card, playerName: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('playCard', {card, playerName});
  }
}

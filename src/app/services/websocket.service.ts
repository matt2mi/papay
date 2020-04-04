import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor(private socket: Socket) { }

  public createPlayer(name) {
    console.log('new-player', name);
    this.socket.emit('new-player');
  }

  public getPlayers = () => {
    return Observable.create((observer) => {
            this.socket.on('refresh-player', (players:[]) => {
                console.log('players', players);
                observer.next(players);
            });
    });
  }
}
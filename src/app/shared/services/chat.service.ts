import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {PlayersService} from '../../services/players.service';

export type Message = {
  message: string;
  color: string
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  getNewMessage$: Observable<Message>;

  constructor(public http: HttpClient, public socket: Socket, public playersService: PlayersService) {
  }

  getNewMessage(): Observable<Message> {
    return this.getNewMessage$ = new Observable((observer) =>
      this.socket.on('newMessage', (message: Message) => {
        if (this.playersService.getCurrentPlayer() && this.playersService.getCurrentPlayer().name !== message.message.split(':')[0]) {
          observer.next(message);
        }
      })
    );
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>('chatMessages');
  }

  addNewMessage(message: string, color: string): Observable<boolean> {
    return this.http.post<boolean>('newChatMessage', {message, color});
  }

  checkAnswer(answer: string): Observable<{ message: string, error: boolean }> {
    return this.http.post<{ message: string, error: boolean }>('checkAnswer', {answer});
  }
}

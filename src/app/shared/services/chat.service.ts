import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject, Observable} from 'rxjs';

export type Messages = {
  message: string;
  color: string
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSource = new BehaviorSubject([]);
  getNewMessages$ = this.messagesSource.asObservable();

  constructor(public http: HttpClient, public socket: Socket) {
  }

  initSocket() {
    this.socket.on('newMessage', (messages: Messages[]) =>
      this.messagesSource.next(messages));
  }

  getMessages(): Observable<Messages[]> {
    return this.http.get<Messages[]>('chatMessages');
  }

  addNewMessage(message: string, color: string) {
    this.http
      .post('newChatMessage', {message, color})
      .subscribe();
  }
}

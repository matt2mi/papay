import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSource = new BehaviorSubject([]);
  getNewMessages$ = this.messagesSource.asObservable();

  constructor(public http: HttpClient, public socket: Socket) {
  }

  initSocket() {
    this.socket.on('newMessage', messages => this.messagesSource.next(messages));
  }

  getMessages(): Observable<{ messages: string[] }> {
    return this.http.get<{ messages: string[] }>('chatMessages');
  }

  addNewMessage(message: string) {
    this.http
      .post('newChatMessage', {message})
      .subscribe();
  }
}

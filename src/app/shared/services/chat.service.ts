import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: string[] = [];
  private messagesSource = new BehaviorSubject([]);
  getNewMessages$ = this.messagesSource.asObservable();

  constructor(public http: HttpClient, public socket: Socket) {
  }

  init() {
    return this.http.get<{messages: string[]}>('chatMessages');
  }

  initSocket() {
    this.socket.on('newMessage', messages => {
      this.messages = messages;
      this.messagesSource.next(messages);
    });
  }

  getMessages(): string[] {
    return this.messages;
  }

  setMessages(messages: string[]) {
    this.messages = messages;
  }

  addNewMessage(message: string) {
    this.http
      .post('newChatMessage', {message})
      .subscribe();
  }
}

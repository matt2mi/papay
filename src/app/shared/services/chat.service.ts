import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: string[];

  constructor() {
  }

  getMessages(): string[] {
    return this.messages;
  }

  setMessages(messages: string[]) {
    this.messages = messages;
  }

  addMessage(message: string): string[] {
    this.messages.push(message);
    return this.messages;
  }
}

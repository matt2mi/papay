import {AfterViewInit, Component, Input} from '@angular/core';
import {ChatService, Messages} from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit {

  @Input() currentPlayerName;
  @Input() currentPlayerColor;
  messages: Messages[] = [];
  message = '';

  constructor(public chatService: ChatService) {
  }

  ngAfterViewInit() {
    this.chatService.initSocket();
    this.chatService.getNewMessages$.subscribe((messages: Messages[]) => this.messages = messages);
    this.chatService.getMessages().subscribe((messages: Messages[]) => this.messages = messages);
  }

  sendMessage() {
    this.chatService.addNewMessage(this.currentPlayerName + ': ' + this.message, this.currentPlayerColor);
    this.message = '';
  }
}

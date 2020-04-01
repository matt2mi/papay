import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit {

  @Input() currentPlayerName;
  messages: string[] = [];
  message = '';
  @ViewChild('chat') private myScrollContainer: ElementRef;

  constructor(public chatService: ChatService) {
  }

  ngAfterViewInit() {
    this.chatService.setMessages(['TODO via websocket']); // TODO via Websocket
    this.messages = this.chatService.getMessages();
    this.scrollChatToBottom();
  }

  sendMessage() {
    this.messages = this.chatService.addMessage(this.currentPlayerName + ': ' + this.message);
    this.message = '';
    setTimeout(() => this.scrollChatToBottom(), 200);
  }

  scrollChatToBottom() {
    return this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
}

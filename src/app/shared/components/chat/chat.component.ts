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
    this.chatService.initSocket();
    this.chatService.getNewMessages$.subscribe(messages => {
      this.messages = messages;
      this.scrollChatToBottom();
    });
    this.chatService.getMessages().subscribe(({messages}) => {
      this.messages = messages;
      this.scrollChatToBottom();
    });
  }

  sendMessage() {
    this.chatService.addNewMessage(this.currentPlayerName + ': ' + this.message);
    this.message = '';
  }

  scrollChatToBottom() {
    return this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
}

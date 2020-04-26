import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @Input() currentPlayerName;
  @Input() currentPlayerColor;
  messages: Message[] = [];
  message = '';

  @ViewChild('chatContainer') private chatContainer: ElementRef;

  constructor(public chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.getMessages().subscribe((messages: Message[]) => this.messages = messages);
    this.chatService.getNewMessage().subscribe((message: Message) => this.messages.push(message));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    const message = this.currentPlayerName + ': ' + this.message;
    const color = this.currentPlayerColor;
    this.chatService.addNewMessage(message, color).subscribe(() => this.messages.push({message, color}));
    this.message = '';
  }

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}

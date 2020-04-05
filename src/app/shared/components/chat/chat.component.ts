import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {HttpClient} from '@angular/common/http';

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

  constructor(public http: HttpClient, public socket: Socket) {
    this.socket.on('new-messages', (messages: string[]) => {
      console.log('socket new-messages', messages);
      this.messages = messages;
    });
  }

  ngAfterViewInit() {
    this.scrollChatToBottom();
  }

  sendMessage() {
    const message = this.currentPlayerName + ': ' + this.message;
    console.log('http sendMessage', message);
    this.messages = this.http
      .post('', { message })
      .subscribe(result => console.log(result));
    this.message = '';
    setTimeout(() => this.scrollChatToBottom(), 200);
  }

  scrollChatToBottom() {
    return this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
}

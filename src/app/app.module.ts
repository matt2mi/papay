import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LoginComponent} from './components/login/login.component';
import {WaitingPlayersComponent} from './components/waiting-players/waiting-players.component';
import {PlayingComponent} from './components/playing/playing.component';
import {ScoresComponent} from './components/scores/scores.component';
import {ChatComponent} from './shared/components/chat/chat.component';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {CardComponent} from './shared/components/card/card.component';
import {MatIconModule} from '@angular/material/icon';

const wsUrl = window.location.origin.replace(/^http/, 'ws');
const socketIOConfig: SocketIoConfig = { url: wsUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WaitingPlayersComponent,
    PlayingComponent,
    ScoresComponent,
    ChatComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(socketIOConfig),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

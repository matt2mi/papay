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

const socketIOConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WaitingPlayersComponent,
    PlayingComponent,
    ScoresComponent,
    ChatComponent
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
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

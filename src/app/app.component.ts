import {Component, OnInit} from '@angular/core';
import {ChatService} from './shared/services/chat.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Papay\'';
  displayChatNotifIcon = false;
  nbNewMessages = 0;

  constructor(public chatService: ChatService, public router: Router) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd && event.url === '/playing'))
      .subscribe(() => this.displayChatNotifIcon = true);
    this.chatService.getNewMessage().subscribe(() => this.nbNewMessages++);
  }

  scrollToChat() {
    this.nbNewMessages = 0;
    const body = document.body;
    const html = document.documentElement;

    const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    window.scrollTo(0, height);
  }
}

/*
Êchanges websocket

- connexion

- envoi pseudo / attente validation d'unicité
  => navigate to waiting

- envoi/attente messages du chat

- soit attente début partie soit envoi démarrer puis attente début partie
  => navigate to playing

- a) attente du deck initial + liste joueurs avec ordre (précédent et suivant pr savoir à qui on donne)

- b) attente pseudos des joueurs qui ont donné (pour afficher qui on attend)

- c) envoi cartes données au suivant

- d) attente cartes à recevoir (nouveau deck entier reçu avec attribut newOne pr nouvelles cartes + famille à 40 pts)

- e) attente pseudo du joueur qui joue (pour afficher qui on attend)

- f) attente du tour de jeu du joueur

- g) envoi de la carte que le joueur joue

- h) attente fin du pli (pseudo qui ramasse le pli)

- i) répéter e, f, g, h jusqu'à attente les scores de fin du tour
  => navigate to scores/en-cours

- répéter a => i jusqu'à attente des scores finaux
  => navigate to scores/game-over

- envoi/attente messages du chat

- attente pseudos qui veulent restart

- envoi restart
  => navigate to playing
 */

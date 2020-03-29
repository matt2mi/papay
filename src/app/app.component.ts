import {Component} from '@angular/core';

/*
 Workflow global
1 - envoi du nom
2 - passage écran attente des joueurs
3 - clic sur démarrer partie
4 - arrivée écran de jeu : voit colonne score total / cartes du pli alimentée par websocket / cartes du deck du joueur
5.1 - figé jusqu'à son tour de jeu
5.2 - notif à lui de jouer, clic sur une carte de son deck
5.3 - figé jusqu'à ce que tout le monde ait joué
6 - répéter étapes 5.* jusqu'à fin du tour (plus personne n'a de cartes - informé via websocket)
7 - arrivée page score du tour
8 - répéter étapes 5.*, 6 et 7 autant de fois qu'il y a de joueurs
9 - arrivée page score final
10 - clic sur relancer partie => étape 2
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Papay\'';
}

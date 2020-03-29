import {Component} from '@angular/core';
import Player from '../../models/player';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';

@Component({
  selector: 'app-waiting-players',
  templateUrl: './waiting-players.component.html',
  styleUrls: ['./waiting-players.component.scss']
})
export class WaitingPlayersComponent {

  currentPlayer: Player;
  connectedPlayers: Player[] = [];

  constructor(public router: Router, public playersService: PlayersService) {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.connectedPlayers = this.playersService.getConnectedPlayers();
    // TODO attente via websocket d'avoir au moins 3 joueurs pour afficher bouton démarrer
    // TODO via websocket démarrer auto quand nb joueurs max (6 pour l'instant)
  }

  startParty() {
    this.router.navigate(['playing']);
  }
}

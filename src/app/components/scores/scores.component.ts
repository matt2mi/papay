import {Component} from '@angular/core';
import Player from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {

  currentPlayer: Player;
  connectedPlayers: Player[];

  constructor(public playersService: PlayersService, public router: Router) {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.playersService.getConnectedPlayers().subscribe((players: Player[]) => this.connectedPlayers = players);
  }

  restart() {
    console.log('restart');
    // TODO appel http / attendre tout le monde / renvoyer un socket pour dire restart
  }
}

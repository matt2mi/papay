import {Component, OnInit} from '@angular/core';
import Player from '../../models/player';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';

@Component({
  selector: 'app-waiting-players',
  templateUrl: './waiting-players.component.html',
  styleUrls: ['./waiting-players.component.scss']
})
export class WaitingPlayersComponent implements OnInit {

  currentPlayer: Player;
  connectedPlayers: Player[] = [];

  constructor(public router: Router, public playersService: PlayersService) {
    this.currentPlayer = this.playersService.getCurrentPlayer();
  }

  ngOnInit() {
    this.playersService.getNewPlayers$
      .subscribe(connectedPlayers => this.connectedPlayers = connectedPlayers);
    this.playersService.getConnectedPlayers()
      .subscribe(({players}) => this.connectedPlayers = players);
  }

  startParty() {
    this.router.navigate(['playing']);
  }
}

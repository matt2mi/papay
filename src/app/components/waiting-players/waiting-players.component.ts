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

  errorMessage = '';
  currentPlayer: Player;
  connectedPlayers: Player[] = [];

  constructor(public router: Router, public playersService: PlayersService) {
  }

  ngOnInit() {
    // this.testFrontOnly();
    this.initComponent();
  }

  initComponent() {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.playersService.newPlayers()
      .subscribe((connectedPlayers: Player[]) => this.connectedPlayers = connectedPlayers);
    this.playersService.getConnectedPlayers()
      .subscribe((players: Player[]) => this.connectedPlayers = players);
    this.playersService.partyStarted().subscribe(() => this.router.navigate(['playing']));
  }

  testFrontOnly() {
    this.currentPlayer = new Player('matt');
    this.connectedPlayers = [
      new Player('mimi'),
      new Player('matt'),
      new Player('hugo'),
      new Player('hugo'),
      new Player('hugo'),
      new Player('hugo'),
      new Player('hugo'),
      new Player('hugo'),
    ];
  }

  startParty() {
    if (this.connectedPlayers.length > 2 && this.connectedPlayers.length < 9) {
      this.playersService.startParty()
        .subscribe(
          () => this.router.navigate(['playing']),
          (error: { error: boolean, message: string }) => this.errorMessage = error.message);
    }
  }
}

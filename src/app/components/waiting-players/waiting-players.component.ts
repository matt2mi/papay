import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Player from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-waiting-players',
  templateUrl: './waiting-players.component.html',
  styleUrls: ['./waiting-players.component.scss']
})
export class WaitingPlayersComponent implements OnInit, OnDestroy {
  showDelete = false;
  private ngUnsubscribe = new Subject();
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
    this.playersService.newPlayers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((connectedPlayers: Player[]) => this.connectedPlayers = connectedPlayers);
    this.playersService.getConnectedPlayers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((players: Player[]) => this.connectedPlayers = players);
    this.playersService.youAreKicked().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((kickerName: string) => {
        alert('Déso, t\'as été kické par ' + kickerName);
        this.router.navigate(['login']);
      });
    this.playersService.playerKicked().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: { kickedName: string, kickerName: string, players: Player[] }) => {
        alert(result.kickedName + ' a été kické par ' + result.kickerName);
        this.connectedPlayers = result.players;
      });
    this.playersService.partyStarted().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.router.navigate(['playing']));
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

  deletePlayer(name: string) {
    console.log('deletePlayer(' + name + ')');
    this.playersService.deletePlayer(name).subscribe(
      ({message}) => console.log('retour', message),
      ({error}) => console.error('retour', error));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

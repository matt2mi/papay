import {Component, OnDestroy} from '@angular/core';
import Player from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  currentPlayer: Player;
  connectedPlayers: Player[];

  constructor(public playersService: PlayersService, public router: Router) {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    this.playersService.getConnectedPlayers().pipe(takeUntil(this.ngUnsubscribe)).subscribe((players: Player[]) => {
      this.connectedPlayers = players.sort((player1, player2) => player1.globalScore - player2.globalScore);
    });
  }

  restart() {
    console.log('restart');
    // TODO appel http / attendre tout le monde / renvoyer un socket pour dire restart
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

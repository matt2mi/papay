import {Component} from '@angular/core';
import Player from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {

  mode = '';
  currentPlayer: Player;
  connectedPlayers: Player[];

  constructor(public playersService: PlayersService, public router: Router, public activatedRoute: ActivatedRoute) {
    this.currentPlayer = this.playersService.getCurrentPlayer();
    // this.connectedPlayers = this.playersService.getConnectedPlayers();
    this.activatedRoute.params.subscribe(params => this.mode = params.mode);
  }

  getLoosingCards(player) {
    // console.log('player', player);
    // TODO : pr les tests, devra être récupérer du back via websocket
    let resultStr = '';
    let result = 0;
    player.collectedLoosingCards.forEach(card => {
      resultStr += ', ' + card.number + ' de ' + card.family.label;
      result += card.number;
    });
    return {result, resultStr};
  }

  nextTurn() {
    this.router.navigate(['playing']);
  }

  restart() {
    this.router.navigate(['login']);
  }
}

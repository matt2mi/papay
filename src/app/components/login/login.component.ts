import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import Player from 'src/app/models/player';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  errorMessage = '';
  createPlayerForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(public router: Router,
    public playersService: PlayersService,
    private websocketService: WebSocketService,) {
  }

  onSubmitName() {
    this.errorMessage = '';
    const name = this.createPlayerForm.get('name').value;

    // TODO envoi nom via websocket et gérer le retour (set errorMessage sinon => waitingPlayersState)
    if (name === 'mimi' || name === 'cle') {
      this.errorMessage = 'nom déjà pris, déso.';
    } else {
      this.playersService.setCurrentPlayerName(name);
      let playerToCreate = new Player(name);
      this.playersService.createPlayer(playerToCreate).subscribe((player) => {
        console.log('Player created', player);
      });
      this.router.navigate(['waiting']);
    }
  }
}

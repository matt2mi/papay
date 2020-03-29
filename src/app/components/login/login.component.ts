import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';

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

  constructor(public router: Router, public playersService: PlayersService) {
  }

  onSubmitName() {
    this.errorMessage = '';
    const name = this.createPlayerForm.get('name').value;

    // TODO envoi nom via websocket et gérer le retour (set errorMessage sinon => waitingPlayersState)
    if (name === 'mimi' || name === 'cle') {
      this.errorMessage = 'nom déjà pris, déso.';
    } else {
      this.playersService.setCurrentPlayerName(name);
      this.router.navigate(['waiting']);
    }
  }
}

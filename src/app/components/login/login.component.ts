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
    const playerName = this.createPlayerForm.get('name').value;
    this.playersService.createPlayer(playerName)
      .subscribe(data => {
          this.playersService.setCurrentPlayerName(data.name);
          this.router.navigate(['waiting']);
        },
        error => {
          this.errorMessage = error.error.message;
        });
  }
}

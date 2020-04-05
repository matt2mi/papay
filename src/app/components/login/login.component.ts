import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';
import Player from 'src/app/models/player';
import {HttpClient} from '@angular/common/http';

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
    public http: HttpClient) {
  }

  onSubmitName() {
    this.errorMessage = '';
    const playerName = this.createPlayerForm.get('name').value;
    console.log(playerName);
    this.http.post<Player>('createPlayer', {name: playerName})
      .subscribe(player => {
        this.router.navigate(['waiting']);
      },
      error => {
        alert(error.error.message);
      });
  }
}

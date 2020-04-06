import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  createPlayerForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(public router: Router, public playersService: PlayersService) {
  }

  ngOnInit() {
    this.playersService.initSocket();
    this.playersService.createPlayer$.subscribe(result => {
      this.errorMessage = '';
      if (result) {
        if (!result.error) {
          this.playersService.setCurrentPlayerName(result.name);
          this.router.navigate(['waiting']);
        } else {
          this.errorMessage = result.message;
        }
      }
    });
  }

  onSubmitName() {
    this.errorMessage = '';
    const playerName = this.createPlayerForm.get('name').value;
    this.playersService.createPlayer(playerName);
  }
}

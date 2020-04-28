import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {PlayersService} from '../../services/players.service';
import {CardsService} from 'src/app/services/cards.service';
import {takeUntil} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  errorMessage = '';
  createPlayerForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(public router: Router,
              public playersService: PlayersService,
              public cardsService: CardsService) {
  }

  ngOnInit() {
    this.playersService.creatingPlayer()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.errorMessage = '';
        if (!result.error.value) {
          this.playersService.setCurrentPlayerNameAndColor(result.name, result.color);
          this.router.navigate(['waiting']);
        } else {
          this.errorMessage = result.error.message;
        }
      });
  }

  onSubmitName() {
    if (this.createPlayerForm.get('name').value !== '') {
      this.errorMessage = '';
      const playerName = this.createPlayerForm.get('name').value;
      this.playersService.createPlayer(playerName);
    } else {
      this.errorMessage = 'ton pseudo !';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

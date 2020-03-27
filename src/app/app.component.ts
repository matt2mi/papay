import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'papay';

  constructor(public http: HttpClient) {}

  round1() {
    this.http
      .post('round', {nbRound: 1, cards: 'cards'})
      .subscribe(a => console.log(a));
  }
}

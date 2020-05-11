import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ChatService} from '../shared/services/chat.service';

@Component({
  selector: 'app-final-game',
  templateUrl: './final-game.component.html',
  styleUrls: ['./final-game.component.scss']
})
export class FinalGameComponent implements OnInit {

  progressValue = 0;
  lettre = 'E';
  submitForm = new FormGroup({
    answer: new FormControl('')
  });
  result = {message: '', error: false};

  constructor(public service: ChatService) {
  }

  ngOnInit(): void {
    setTimeout(() => this.addProgress(), 5000);
  }

  onSubmit() {
    this.result = {message: '', error: false};
    this.service.checkAnswer(this.submitForm.get('answer').value)
      .subscribe(
        (result: { message: string, error: boolean }) => {
          console.log(result.message);
          this.result = result;
        }
      );
  }

  addProgress() {
    setTimeout(() => {
      this.progressValue++;
      if (this.progressValue < 100) {
        this.addProgress();
      } else {
        setTimeout(() => this.lettre = 'loupé ! Recharge la page !', 3000);
      }
    }, 500);
  }
}

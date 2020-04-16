import {Component, EventEmitter, Input, Output} from '@angular/core';
import Card from '../../../models/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() card: Card;
  @Input() is40Seven = false;
  @Output() clickCard = new EventEmitter<Card>();

  constructor() { }

  onClickCard() {
    this.clickCard.emit(this.card);
  }
}

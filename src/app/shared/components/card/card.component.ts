import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() number = 0;
  @Input() familyId: number;
  @Input() isPlayable = true;
  @Input() zIndexCard = 0;

  familyClass = '';
  papayooClass = '';
  papayooLogoClass = '';
  papayoosNumbers = '';
  zIndexCardNotPlayable = 0;

  constructor() { }

  ngOnInit(): void {
    this.zIndexCardNotPlayable = this.zIndexCard + 1;

    switch (this.familyId) {
      case 0:
        this.familyClass = 'spades';
        break;
      case 1:
        this.familyClass = 'hearts';
        break;
      case 2:
        this.familyClass = 'diamonds';
        break;
      case 3:
        this.familyClass = 'chamrocks';
        break;
      case 4:
        this.familyClass = 'papayoos';
        this.papayoosNumbers = 'papayoos-numbers';
        break;
    }

    this.papayooClass = this.familyClass + '-logo';
    this.papayooLogoClass = this.familyClass + '-logo-papayoo';
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import Card from '../../../models/card';
import {FAMILIES} from '../../../models/family';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.card = new Card(1, FAMILIES[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

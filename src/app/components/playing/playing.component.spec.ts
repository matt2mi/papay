import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayingComponent} from './playing.component';
import {RouterTestingModule} from '@angular/router/testing';
import Card from '../../models/card';
import {FAMILIES} from '../../models/family';
import Player from '../../models/player';

describe('PlayingComponent', () => {
  let component: PlayingComponent;
  let fixture: ComponentFixture<PlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayingComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('can play a card because one of good family', () => {
    component.cardFold = [
      {card: new Card(1, FAMILIES[0]), player: new Player()}
    ];
    component.currentPlayer = new Player('player1', [
      new Card(1, FAMILIES[0]),
      new Card(1, FAMILIES[2])
    ]);

    component.canPlayCards();

    expect(component.currentPlayer.deck[0].isPlayable).toBeTruthy();
    expect(component.currentPlayer.deck[1].isPlayable).toBeFalsy();
  });

  fit('can play any card because no one of good family', () => {
    component.cardFold = [
      {card: new Card(1, FAMILIES[0]), player: new Player()}
    ];
    component.currentPlayer = new Player('player', [
      new Card(2, FAMILIES[1]),
      new Card(5, FAMILIES[1]),
      new Card(5, FAMILIES[4])
    ]);

    component.canPlayCards();

    expect(component.currentPlayer.deck[0].isPlayable).toBeTruthy();
    expect(component.currentPlayer.deck[1].isPlayable).toBeTruthy();
    expect(component.currentPlayer.deck[2].isPlayable).toBeTruthy();
  });

  fit('can play any card because first to play', () => {
    component.cardFold = [];
    component.currentPlayer = new Player('player', [
      new Card(2, FAMILIES[1]),
      new Card(5, FAMILIES[2]),
      new Card(5, FAMILIES[4])
    ]);

    component.canPlayCards();

    expect(component.currentPlayer.deck[0].isPlayable).toBeTruthy();
    expect(component.currentPlayer.deck[1].isPlayable).toBeTruthy();
    expect(component.currentPlayer.deck[2].isPlayable).toBeTruthy();
  });
});

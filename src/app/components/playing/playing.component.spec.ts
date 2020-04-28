import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayingComponent} from './playing.component';
import {RouterTestingModule} from '@angular/router/testing';
import Card from '../../models/card';
import {FAMILIES} from '../../models/family';
import Player from '../../models/player';
import {PlayersService} from '../../services/players.service';
import {CardsService} from '../../services/cards.service';
import {of} from 'rxjs';

describe('PlayingComponent', () => {
  let component: PlayingComponent;
  let fixture: ComponentFixture<PlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayingComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: PlayersService, useValue: {
            getCurrentPlayer: () => new Player(),
            getCurrentPlayerDeck: () => of(),
            getConnectedPlayers: () => of(),
            waitedGivingCardsPlayers: () => of(),
            nextPlayerTurn: () => of(),
            roundLooser: () => of(),
            endOfTour: () => of(),
            waitedPlayersForNextTour: () => of(),
            newTour: () => of(),
            gameOver: () => of(),
            playerDisconnected: () => of()
          }
        },
        {
          provide: CardsService, useValue: {
            getDeckWithGivenCards: () => of()
          }
        },
      ]
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

  it('can play a card because one of good family', () => {
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

  it('can play any card because no one of good family', () => {
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

  it('can play any card because first to play', () => {
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

  it('should set Left And Right Players when odd nb players', () => {
    component.currentPlayer = new Player('matt');
    component.connectedPlayers = [
      new Player('mimi'),
      new Player('matt'),
      new Player('toyo'),
      new Player('coco'),
      new Player('gu'),
      new Player('cle'),
      new Player('marion')
    ];
    const expectedLeftPlayers = [
      new Player('cle'),
      new Player('marion'),
      new Player('mimi')
    ];
    const expectedRightPlayers = [
      new Player('gu'),
      new Player('coco'),
      new Player('toyo')
    ];
    component.rightPlayers = [];
    component.leftPlayers = [];

    component.setLeftAndRightPlayers();

    expect(component.leftPlayers).toEqual(expectedLeftPlayers);
    expect(component.rightPlayers).toEqual(expectedRightPlayers);
  });

  it('should set Left And Right Players when even nb players', () => {
    component.currentPlayer = new Player('matt');
    component.connectedPlayers = [
      new Player('mimi'),
      new Player('matt'),
      new Player('toyo'),
      new Player('coco'),
      new Player('gu'),
      new Player('cle'),
      new Player('marion'),
      new Player('fiona')
    ];
    const expectedLeftPlayers = [
      new Player('cle'),
      new Player('marion'),
      new Player('fiona'),
      new Player('mimi')
    ];
    const expectedRightPlayers = [
      new Player('gu'),
      new Player('coco'),
      new Player('toyo')
    ];
    component.rightPlayers = [];
    component.leftPlayers = [];

    component.setLeftAndRightPlayers();

    expect(component.leftPlayers).toEqual(expectedLeftPlayers);
    expect(component.rightPlayers).toEqual(expectedRightPlayers);
  });
});

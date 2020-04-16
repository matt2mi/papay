import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WaitingPlayersComponent} from './waiting-players.component';
import {PlayersService} from '../../services/players.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';

describe('WaitingPlayersComponent', () => {
  let component: WaitingPlayersComponent;
  let fixture: ComponentFixture<WaitingPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingPlayersComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: PlayersService, useValue: {
            getCurrentPlayer: () => {
            },
            newPlayers$: of(),
            getConnectedPlayers: () => of(),
            partyStarted$: of(),
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

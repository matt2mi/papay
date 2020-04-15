import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoresComponent} from './scores.component';
import {PlayersService} from '../../services/players.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';

describe('ScoresComponent', () => {
  let component: ScoresComponent;
  let fixture: ComponentFixture<ScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScoresComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: PlayersService, useValue: {
            getCurrentPlayer: () => {
            },
            getConnectedPlayers: () => of(),
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

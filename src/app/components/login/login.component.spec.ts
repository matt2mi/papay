import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {PlayersService} from '../../services/players.service';
import {RouterTestingModule} from '@angular/router/testing';
import {CardsService} from '../../services/cards.service';
import {of} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: PlayersService, useValue: {
            initSocket: () => {
            },
            createPlayer$: of(),
          }
        },
        {
          provide: CardsService, useValue: {
            initSocket: () => {
            }
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WaitingPlayersComponent} from './waiting-players.component';

describe('WaitingPlayersComponent', () => {
  let component: WaitingPlayersComponent;
  let fixture: ComponentFixture<WaitingPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingPlayersComponent]
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

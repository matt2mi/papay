import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalGameComponent } from './final-game.component';

describe('FinalGameComponent', () => {
  let component: FinalGameComponent;
  let fixture: ComponentFixture<FinalGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

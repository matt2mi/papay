import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoonGameComponent } from './noon-game.component';

describe('NoonGameComponent', () => {
  let component: NoonGameComponent;
  let fixture: ComponentFixture<NoonGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoonGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoonGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

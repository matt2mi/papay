import {TestBed} from '@angular/core/testing';

import {CardsService} from './cards.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Socket} from 'ngx-socket-io';

describe('CardsService', () => {
  let service: CardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [{provide: Socket, useValue: {}}]
    });
    service = TestBed.inject(CardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

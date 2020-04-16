import {TestBed} from '@angular/core/testing';

import {PlayersService} from './players.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Socket} from 'ngx-socket-io';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: Socket, useValue: {}}]
    });
    service = TestBed.inject(PlayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

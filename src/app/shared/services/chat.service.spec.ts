import {TestBed} from '@angular/core/testing';

import {ChatService} from './chat.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Socket} from 'ngx-socket-io';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: Socket, useValue: {}}]
    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

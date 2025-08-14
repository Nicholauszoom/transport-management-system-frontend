import { TestBed } from '@angular/core/testing';

import { ClientRvService } from './client-rv.service';

describe('ClientRvService', () => {
  let service: ClientRvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

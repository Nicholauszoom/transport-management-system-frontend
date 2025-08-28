import { TestBed } from '@angular/core/testing';

import { TakeoverBalanceService } from './takeover-balance.service';

describe('TakeoverBalanceService', () => {
  let service: TakeoverBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TakeoverBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

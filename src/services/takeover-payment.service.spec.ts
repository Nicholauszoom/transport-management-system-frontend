import { TestBed } from '@angular/core/testing';

import { TakeoverPaymentService } from './takeover-payment.service';

describe('TakeoverPaymentService', () => {
  let service: TakeoverPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TakeoverPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

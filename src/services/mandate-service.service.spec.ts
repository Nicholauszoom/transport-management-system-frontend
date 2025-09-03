import { TestBed } from '@angular/core/testing';

import { MandateServiceService } from './mandate-service.service';

describe('MandateServiceService', () => {
  let service: MandateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

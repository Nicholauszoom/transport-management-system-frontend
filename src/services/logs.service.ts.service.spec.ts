import { TestBed } from '@angular/core/testing';

import { LogsServiceTsService } from './logs.service.ts.service';

describe('LogsServiceTsService', () => {
  let service: LogsServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogsServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

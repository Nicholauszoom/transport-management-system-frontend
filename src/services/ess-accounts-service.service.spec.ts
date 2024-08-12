import { TestBed } from '@angular/core/testing';
import { EssAccountsService } from './ess-accounts-service.service';

describe('EssAccountsServiceService', () => {
  let service: EssAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EssAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UploadTaxiService } from './upload-taxi.service';

describe('UploadTaxiService', () => {
  let service: UploadTaxiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadTaxiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTaxiComponent } from './upload-taxi.component';

describe('UploadTaxiComponent', () => {
  let component: UploadTaxiComponent;
  let fixture: ComponentFixture<UploadTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

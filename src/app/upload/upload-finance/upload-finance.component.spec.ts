import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFinanceComponent } from './upload-finance.component';

describe('UploadFinanceComponent', () => {
  let component: UploadFinanceComponent;
  let fixture: ComponentFixture<UploadFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

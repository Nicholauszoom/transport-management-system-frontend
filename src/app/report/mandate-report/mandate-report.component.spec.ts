import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateReportComponent } from './mandate-report.component';

describe('MandateReportComponent', () => {
  let component: MandateReportComponent;
  let fixture: ComponentFixture<MandateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

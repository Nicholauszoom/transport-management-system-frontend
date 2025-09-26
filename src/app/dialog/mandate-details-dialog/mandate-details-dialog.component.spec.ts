import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateDetailsDialogComponent } from './mandate-details-dialog.component';

describe('MandateDetailsDialogComponent', () => {
  let component: MandateDetailsDialogComponent;
  let fixture: ComponentFixture<MandateDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandateDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

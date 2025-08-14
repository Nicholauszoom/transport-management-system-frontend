import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSheduleComponent } from './price-shedule.component';

describe('PriceSheduleComponent', () => {
  let component: PriceSheduleComponent;
  let fixture: ComponentFixture<PriceSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceSheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

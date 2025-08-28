import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoverPaymentViewComponent } from './takeover-payment-view.component';

describe('TakeoverPaymentViewComponent', () => {
  let component: TakeoverPaymentViewComponent;
  let fixture: ComponentFixture<TakeoverPaymentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeoverPaymentViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeoverPaymentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

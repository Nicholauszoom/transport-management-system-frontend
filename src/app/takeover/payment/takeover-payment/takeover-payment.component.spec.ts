import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoverPaymentComponent } from './takeover-payment.component';

describe('TakeoverPaymentComponent', () => {
  let component: TakeoverPaymentComponent;
  let fixture: ComponentFixture<TakeoverPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeoverPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeoverPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

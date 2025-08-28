import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoverBalanceViewComponent } from './takeover-balance-view.component';

describe('TakeoverBalanceViewComponent', () => {
  let component: TakeoverBalanceViewComponent;
  let fixture: ComponentFixture<TakeoverBalanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeoverBalanceViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeoverBalanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

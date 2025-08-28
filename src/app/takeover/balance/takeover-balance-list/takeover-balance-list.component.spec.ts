import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoverBalanceListComponent } from './takeover-balance-list.component';

describe('TakeoverBalanceListComponent', () => {
  let component: TakeoverBalanceListComponent;
  let fixture: ComponentFixture<TakeoverBalanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeoverBalanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeoverBalanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

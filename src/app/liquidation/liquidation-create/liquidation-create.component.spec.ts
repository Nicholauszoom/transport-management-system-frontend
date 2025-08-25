import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationCreateComponent } from './liquidation-create.component';

describe('LiquidationCreateComponent', () => {
  let component: LiquidationCreateComponent;
  let fixture: ComponentFixture<LiquidationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidationCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerFormComponent } from './ess-accounts-form.component';

describe('BorrowerFormComponent', () => {
  let component: BorrowerFormComponent;
  let fixture: ComponentFixture<BorrowerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
